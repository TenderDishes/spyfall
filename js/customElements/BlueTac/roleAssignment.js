//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class RoleAssignment
shows the role assignment screen
styleHooks:
    --bluetac-button-background-color
    --bluetac-button-border
    --bluetac-button-width
    --bluetac-button-box-shadow
*/
class RoleAssignment extends HTMLElement {
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
                .card {
                    display: grid;
                    grid-template-rows: 1fr 1rem 1rem 2rem;
                }

                .card img {
                    width: 100%;
                }

                /* style for img elements wich are in our custom element but not in the shadow dom */
                ::slotted(img) {
                    width: 100%;
                }

                #overlay {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    z-index: 100;
                    background-color: black;
                }

                button[type=submit] {
                    background-color: var(--bluetac-button-background-color, initial);
                    border: var(--bluetac-button-border, initial);
                    width: var(--bluetac-button-width, initial);
                    box-shadow: var(--bluetac-button-box-shadow, initial);
                    margin-top: 1rem;
                }

                button[type=submit]:active {
                    background-color: lightcyan;
                }
            </style>

            <div id="overlay"></div>
            <div class="card">
                <slot name="locationImage">
                    <img src="img/background/vintage_car.jpg"/>
                </slot>
                <slot name="locationDescription">
                    <span>Location: Entenhusten</span>
                </slot>
                <slot name="role">
                    <span>Rolle: Donamed Ducks</span>
                </slot>
                <button type="submit">Next!</button>
            </div>
        `;
    }
}

//define the custom element 'bluetac-role-assignment' with the behaviour of the class 'RoleAssignment'
window.customElements.define('bluetac-role-assignment', RoleAssignment);
