class GameRoutine {
    constructor() {
        logger.log('Start initialisation process...');

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

        let shadowRoot = this.pages[0].shadowRoot;
        this.players = shadowRoot.querySelector('input[name=players]').value;
        this.time = shadowRoot.querySelector('input[name=time]').value;

        this.nextPage();
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
        }
    }

    /*
    main game logic, starts the countdown and checks the time to end the game
    */
    startCountdown() {
        let child = this.nextPage();

        if (child !== undefined && child !== false && this.time !== undefined && this.time !== '0') {
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
            console.error("Could not set time on attribute.");
        }
    }
}
