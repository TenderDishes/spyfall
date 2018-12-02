class GameRoutine {
    constructor(URL) {
        logger.log('Start initialisation process...');

        this.URL = URL;

        //fetch game data only once and set this.data
        this.getPlayData();

        /* Page Index:
            0: Start
            1: Role Assignment
            2: Discussion
            3: EndScreen
        */
        this.pages = [
            document.createElement('bluetac-start-screen'),
            document.createElement('bluetac-role-assignment'),
            document.createElement('bluetac-game-running'),
            document.createElement('bluetac-end-screen')
        ];

        this.pages[0].shadowRoot.querySelector('button[type=submit]').onclick = (e) => { this.initGame(e) };
        this.pages[1].shadowRoot.querySelector('button[type=submit]').onclick = (e) => { this.nextPlayer(e) };
        this.pages[2].shadowRoot.querySelector('button[type=submit]').onclick = (e) => { this.nextPage() };
        this.pages[3].shadowRoot.querySelector('button[type=submit]').onclick = (e) => { this.nextPage() };

        this.pages[1].shadowRoot.querySelector('#overlay').addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.target.style.display = "none";
        });
        this.pages[1].shadowRoot.querySelector('#overlay').addEventListener("click", (e) => {
            e.preventDefault();
            e.target.style.display = "none";
        });

        this.reset();

        logger.log('... initialisation process finished.');
    }

    /*
    resets variables and append start screen
    */
    reset() {
        logger.log('reset()');
        this.currentPage = 0;
        this.players = 0;
        this.time = 0;
        this.playerIndex = 0;
        this.assignedRoles = [];
        this.currentArea = undefined;

        return document.body.appendChild(this.pages[0]);
    }

    /*
    switches to the next page in pages array and if the end of the array is reached restart
    */
    nextPage() {
        logger.log('nextPage()');
        document.body.removeChild(this.pages[this.currentPage]);

        this.currentPage++;
        if (this.currentPage < this.pages.length) {
            return document.body.appendChild(this.pages[this.currentPage]);
        } else {
            return this.reset();
        }
    }

    /*
    initialise game variables
    */
    initGame(e) {
        //prevent default reload behavior
        e.preventDefault();
        logger.log('initGame()');

        if(this.data !== undefined) {
            let playAreas = this.data.playAreas;
            let shadowRoot = this.pages[0].shadowRoot;
            let randomNumber = Math.floor(Math.random() * playAreas.length);

            this.currentArea = playAreas[randomNumber];
            this.players = shadowRoot.querySelector('input[name=players]').value;
            this.time = shadowRoot.querySelector('input[name=time]').value;

            this.renderRandomRole();

            this.nextPage();
        } else {
            logger.error("Could not gather game data!");
        }
    }

    renderRandomRole() {
        logger.log('renderRandomRole()');
        let randomRole = Math.floor(Math.random() * this.currentArea.roles.length);
        if(!this.assignedRoles.includes(randomRole)) {
            this.assignedRoles.push(randomRole);

            this.pages[1].shadowRoot.querySelector('#overlay').style.display = "block";
            this.pages[1].innerHTML = `
                    <img slot="locationImage" src="img/`+this.currentArea.picture+`"/>
                    <span slot="locationDescription">Location: `+this.currentArea.name+`</span>
                    <span slot="role">Rolle: `+this.currentArea.roles[randomRole];+`</span>
            `;
        } else if (this.assignedRoles.length >= this.currentArea.roles.length) {
            logger.error("No roles left!");
        } else {
            this.renderRandomRole();
        }
    }

    /*
    show the location and role to the next player
    */
    nextPlayer(e) {
        e.preventDefault();
        logger.log('nextPlayer()');

        this.playerIndex++;

        if (this.playerIndex >= this.players) {
            logger.log('all roles shown');
            //pass time for the next elements inner html
            this.startCountdown();
        } else {
            this.renderRandomRole();
        }
    }

    /*
    main game logic, starts the countdown and checks the time to end the game
    */
    startCountdown() {
        let child = this.nextPage();

        if(this.time !== '0') {
            if (child !== undefined && child !== false && this.time !== undefined) {
                child.setAttribute('timelimit', this.time);
                let slot = child.shadowRoot.querySelector('slot');
                slot.addEventListener('slotchange', e => {
                  if (child.getAttribute('currentTime') === '0') {
                      slot.innerHTML = "∞";
                      child.setAttribute('currentTime', '-');
                      logger.log("Fertig!");
                      this.nextPage();
                  }
                });
            } else {
                logger.error("Could not set time on attribute.");
            }
        } else {
            logger.log("No time set");
        }
    }

    getPlayData() {
        logger.log("getPlayData()");
        fetch(this.URL+"data/playAreas.json")
        .then(response => response.json()) //ransform the data into json
        .then(response => {
            this.data = response;
            //add spy role to all playAreas
            this.data.playAreas.forEach((value) => {
                value.roles.push("Spy");
            })
        })
        .catch(error => logger.error('Error:', error));
    }
}
