//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class StartScreen
shows the game start
styleHooks:
    --bluetac-button-background-color
    --bluetac-button-border
    --bluetac-button-width
    --bluetac-button-box-shadow
*/
class StartScreen extends HTMLElement {
    /*
    get if attribute 'disabled' is present
    params: -
    returns: [bool]
    */
    get disabled() {
        return this.hasAttribute('disabled');
    }

    /*
    set disabled attribute
    params: [string]attributValue
    returns: -
    note: setter must have one argument
    */
    set disabled(val) {
        this.setAttribute('disabled', '');
    }

    //constructor
    constructor() {
        //must be called first according to the specs
        super();

        //https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
        //attach shadow dom in open (public) mode to the element and store it to the var
        let shadowRoot = this.attachShadow({mode: 'open'});
        //set the HTML of the shadow dom
        shadowRoot.innerHTML = `
            <style>
                /* source: https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */
                input[type=range] {
                    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
                    width: 100%; /* Specific width is required for Firefox. */
                    margin: 0;
                    background: transparent; /* Otherwise white in Chrome */
                }

                input[type=range]:focus {
                    outline: 0;
                    box-shadow: 0 0 5px cornflowerblue;
                }

                /* Styling for WebKit/Blink */
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    background-color: white;
                    width: 10px;
                    height: 10px;
                    margin-top: -3.6px;
                    border-color: black;
                    border-radius: 0;
                    border-style: solid;
                    border-width: 1px;
                    box-shadow: 0 0 5px black;
                    cursor: pointer;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    background-color: black;
                    height: 2px;
                }
                input[type=range]:focus::-webkit-slider-runnable-track {

                }

                /* Styling for Firefox */
                input[type=range]::-moz-range-thumb {
                    background-color: white;
                    width: 10px;
                    border-color: black;
                    border-radius: 0;
                    box-shadow: 0 0 5px black;
                    cursor: pointer;
                }
                input[type=range]::-moz-range-track {
                    background-color: black;
                    height: 2px;
                }

                form {
                    display: grid;
                    grid-template-columns: 100fr;
                    grid-row-gap: 15px;
                }

                input[type=number] {
                    background-color: transparent;
                    border: 1px solid black;
                    width: calc(100% - 20px);
                    box-shadow: 0 0 4px black;
                    padding: 2px 9px;
                    border-radius: 0;
                }

                button[type=submit] {
                    background-color: var(--bluetac-button-background-color, initial);
                    border: var(--bluetac-button-border, initial);
                    width: var(--bluetac-button-width, initial);
                    box-shadow: var(--bluetac-button-box-shadow, initial);
                }

                .center {
                    position: absolute;
                    left: 50vw;
                    top: 50vh;
                    transform: translate(-50%, -50%);
                }
            </style>

            <form oninput="timeOutput.value = String( parseInt( time.value ) / 60) + ' Minutes'">
                <div class="formSection">
                    <label for="players">Players:</label>
                    <!-- set pattern for ios keyboard layout -->
                    <input type="number" value="2" min="2" step="1" name="players" pattern="\\d*"/>
                </div>

                <div class="formSection">
                    <label for="time">Time:</label>
                    <output for="time" name="timeOutput">0 Minutes</output>
                    <input type="range" value="0" min="0" max="3600" step="300" name="time"/>
                </div>

                <div class="formSection">
                    <label>a Spy in any case:<input type="checkbox" name="forceASpy"></input></label>
                </div>

                <div class="formSection">
                    <button type="submit">Play!</button>
                </div>
            </form>
        `;
    }
}

//define the custom element 'bluetac-start-screen' with the behaviour of the class 'StartScreen'
window.customElements.define('bluetac-start-screen', StartScreen);
