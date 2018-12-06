//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class GameRunning
shows the game running
styleHooks:
    --bluetac-button-background-color
    --bluetac-button-border
    --bluetac-button-width
    --bluetac-button-box-shadow
*/
class GameRunning extends HTMLElement {
    //listen for changes of the given attributes and automatically call attributeChangedCallback()
    static get observedAttributes() {
        return ['timelimit'];
    }

    /*
    get value of 'timelimit'
    params: -
    returns: [string]
    */
    get timelimit() {
        return this.getAttribute('timelimit');
    }

    /*
    set the 'timelimit' attribute
    params: [int|string] time limit
    returns: -
    */
    set timelimit(val) {
        this.setAttribute('timelimit', val);
    }

    /*
    get value of 'currentTime'
    params: -
    returns: [string]
    */
    get currentTime() {
        return this.getAttribute('currentTime');
    }

    /*
    set 'currentTime' attribute
    params: [int|string] current time
    returns: -
    note: setter must have one argument
    */
    set currentTime(val) {
        this.setAttribute('currentTime', val);
    }

    //constructor
    constructor() {
        //must be called first according to the specs
        super();

        let timer = undefined;
        let time = 0;

        //https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
        //attach shadow dom in open (public) mode to the element and store it to the var
        let shadowRoot = this.attachShadow({mode: 'open'});
        //set the HTML of the shadow dom
        shadowRoot.innerHTML = `
            <style>
                .center {
                    position: absolute;
                    left: 50vw;
                    top: 50vh;
                    transform: translate(-50%, -50%);
                }

                .center > .animated {
                    /* source: https://www.w3schools.com/cssref/css3_pr_animation.asp */
                    -webkit-animation: pulse 5s infinite cubic-bezier(.56,0,.47,1.01); /* Safari 4.0 - 8.0 */
                    animation: pulse 5s infinite cubic-bezier(.56,0,.47,1.01);
                }

                .centerAlign {
                    text-align: center;
                }

                /* Safari 4.0 - 8.0 */
                @-webkit-keyframes pulse {
                    0% {
                        font-size: 1rem;
                    }
                    50% {
                        font-size: 1.5rem;
                    }
                    100% {
                        font-size: 1rem;
                    }
                }

                @keyframes pulse {
                    0% {
                        font-size: 1rem;
                    }
                    50% {
                        font-size: 1.5rem;
                    }
                    100% {
                        font-size: 1rem;
                    }
                }

                button[type=submit] {
                    background-color: var(--bluetac-button-background-color, initial);
                    border: var(--bluetac-button-border, initial);
                    width: var(--bluetac-button-width, initial);
                    box-shadow: var(--bluetac-button-box-shadow, initial);
                }
            </style>

            <div>
                <div class="alignCenter">
                    <p>Find the spy, or the location!</p>
                    <p>Time left: <slot>∞</slot></p>
                </div>
                <button type="submit">Stop!</button>
            </div>
        `;
    }

    /*
    https://developers.google.com/web/fundamentals/web-components/customelements#reactions
    called for every attribute set in observedAttributes
    */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'timelimit') {
            this.innerHTML = this.formatTime(newValue);
            this.setAttribute('currentTime', newValue);
            clearInterval(this.timer);
            this.time = newValue;
            this.timer = setInterval(() => {
                this.time = this.time - 1;
                if(this.time <= 0) {
                    clearInterval(this.timer);
                }
                this.innerHTML = this.formatTime(this.time);
                this.setAttribute('currentTime', this.time);
            }, 1000);
        }
    }

    /*
    formats a time value into a digital clock format
    params: [int] current time in seconds
    returns: [string] time
    */
    formatTime(time) {
        return Math.floor(time/60) + ":" + time%60;
    }
}

//define the custom element 'bluetac-game-running' with the behaviour of the class 'GameRunning'
window.customElements.define('bluetac-game-running', GameRunning);
