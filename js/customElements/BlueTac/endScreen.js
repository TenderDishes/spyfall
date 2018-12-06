//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class EndScreen
shows the end screen
styleHooks:
    --bluetac-button-background-color
    --bluetac-button-border
    --bluetac-button-width
    --bluetac-button-box-shadow
*/
class EndScreen extends HTMLElement {
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
                .center {
                    position: absolute;
                    left: 50vw;
                    top: 50vh;
                    transform: translate(-50%, -50%);
                }

                .centerAlign {
                    text-align: center;
                }

                button[type=submit] {
                    background-color: var(--bluetac-button-background-color, initial);
                    border: var(--bluetac-button-border, initial);
                    width: var(--bluetac-button-width, initial);
                    box-shadow: var(--bluetac-button-box-shadow, initial);
                }
            </style>

            <div>
                <div class="centerAlign">
                    <p>Fin!</p>
                </div>
                <button type="submit">Restart</button>
            </div>
        `;
    }
}

//define the custom element 'bluetac-end-screen' with the behaviour of the class 'EndScreen'
window.customElements.define('bluetac-end-screen', EndScreen);
