class GameRoutine {
    constructor(URL) {
        logger.log('Start initialisation process...');

        this.URL = URL;

        //fetch game data only once and set this.data
        this.getPlayData().then(() => {
            //start the rendering when the game data is fetched successfully
            this.reset();

            this.renderMessage('Max Players: '+this.getMaxPlayers());
        });

        /* Page Index:
            0: Start
            1: Role Assignment
            2: Discussion
            3: End
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

        let audioTag = document.createElement('audio');
        audioTag.autoplay = false;
        audioTag.controls = false;
        audioTag.loop = false;
        audioTag.muted = false;
        audioTag.preload = "auto";
        audioTag.src = "sounds/alarm_beep.wav";
        audioTag.volume = 1;
        this.audio = document.body.appendChild(audioTag);

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
        this.forceASpy = false;
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
            let shadowRoot = this.pages[0].shadowRoot;

            this.players = shadowRoot.querySelector('input[name=players]').value;
            this.time = shadowRoot.querySelector('input[name=time]').value;
            this.forceASpy = shadowRoot.querySelector('input[name=forceASpy]').checked;

            if(!this.setRandomPlayArea()) {
                logger.error("Could not find a gameArea that have enough playable slots.");
                return false;
            }

            this.renderRandomRole();

            this.nextPage();
        } else {
            logger.error("Could not gather game data!");
        }
    }

    /*
    sets a random game area that is playable
    */
    setRandomPlayArea() {
        logger.log('setRandomPlayArea()');
        let availableAreas = [];
        let playAreas = this.data.playAreas;

        playAreas.forEach((playArea) => {
            if(playArea.roles.length >= this.players) {
                availableAreas.push(playArea);
            }
        });

        if(availableAreas.length > 0) {
            while (this.currentArea === undefined) {
                let randomNumber = Math.floor(Math.random() * playAreas.length);
                if(this.players <= playAreas[randomNumber].roles.length) {
                    this.currentArea = playAreas[randomNumber];
                    return true;
                }
            }
        }

        return false;
    }

    /*
    prepare the custom element to show the next players assignment
    */
    renderRandomRole() {
        logger.log('renderRandomRole()');
        let randomRole = Math.floor(Math.random() * this.currentArea.roles.length);
        if(!this.assignedRoles.includes(randomRole)) {
            //if a spy is a must have and there is none within the players -> assign one
            if(this.forceASpy && this.playerIndex >= this.players-1 && randomRole !== this.currentArea.roles.length-1 && !this.isSpyAssigned()) {
                //note: not the best solution, because the last player has a higher change to be the spy
                //https://stackoverflow.com/questions/3983660/probability-in-javascript-help
                randomRole = this.currentArea.roles.length-1;
            }

            this.assignedRoles.push(randomRole);

            this.pages[1].shadowRoot.querySelector('#overlay').style.display = "block";
            if(randomRole !== this.currentArea.roles.length-1) {
                this.pages[1].innerHTML = `
                        <img slot="locationImage" src="img/`+this.currentArea.picture+`"/>
                        <span slot="locationDescription">Location: `+this.currentArea.name+`</span>
                        <span slot="role">Rolle: `+this.currentArea.roles[randomRole];+`</span>
                `;
            } else {
                this.pages[1].innerHTML = `
                        <img slot="locationImage" src="img/`+this.data.spy.picture+`"/>
                        <span slot="locationDescription">Location: unknown</span>
                        <span slot="role">Rolle: `+this.currentArea.roles[randomRole];+`</span>
                `;
            }
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
            if(this.forceASpy && !this.isSpyAssigned()) {
                logger.error('No Spy assigned');
            }

            logger.log('all roles shown');
            //pass time for the next elements inner html
            this.startCountdown();
        } else {
            this.renderRandomRole();
        }
    }

    /*
    checks if a spy is already assigned
    */
    isSpyAssigned() {
        let roles = [];
        this.assignedRoles.forEach((value) => {
            roles.push(this.currentArea.roles[value]);
        });

        if(roles.includes('Spy')) {
            return true;
        }
        return false;
    }

    /*
    main game logic, starts the countdown and checks the time to end the game
    */
    startCountdown() {
        logger.log('startCountdown()');
        let child = this.nextPage();

        if(this.time !== '0') {
            if (child !== undefined && child !== false && this.time !== undefined) {
                child.setAttribute('timelimit', this.time);
                let slot = child.shadowRoot.querySelector('slot');
                slot.addEventListener('slotchange', e => {
                  if (child.getAttribute('currentTime') === '0') {
                      slot.innerHTML = "∞";
                      child.setAttribute('currentTime', '-');
                      this.audio.play();
                      logger.log("Time is up!");
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

    /*
    fetch the player data from server asynchronous in order to update the game data every time
    */
    getPlayData() {
        logger.log("getPlayData()");
        return fetch(this.URL+"data/playAreas.json")
        .then(response => response.json()) //ransform the data into json
        .then(response => {
            this.data = response;
            //add spy role to all playAreas
            this.data.playAreas.forEach((value) => {
                value.roles.push("Spy");
            })
        })
        .catch(error => {
            logger.error(error.message)
        });
    }

    /*
    returns the maximal available players for the given game data
    */
    getMaxPlayers() {
        let maxPlayers = 0;
        this.data.playAreas.forEach((playArea) => {
            if(playArea.roles.length > maxPlayers) {
                maxPlayers = playArea.roles.length;
            }
        });
        return maxPlayers;
    }

    renderMessage(variable) {
        let message = document.body.appendChild(document.createElement('bluetac-message'));
        message.setAttribute('type','info');
        message.innerHTML = variable;
    }
}
