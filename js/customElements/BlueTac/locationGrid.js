//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}


class LocationGrid extends HTMLElement {
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
                /* further help: https://css-tricks.com/snippets/css/complete-guide-grid/ */
                .locations {
                    display: grid;
                    grid-template-columns: 33fr 33fr 33fr;
                }

                .locations > .location {
                    padding: 5% 5%;
                    margin-bottom: 5px;
                }

                .locations > .location:hover {
                    box-shadow: 0 0 5px black;
                }

                .locations > .location > img {
                    width: 100%;
                    height: auto;
                }

                .locations > .location > p {
                    margin: 0;
                }
            </style>
            <!--TODO: get list of locations and loop through-->
            <div class="locations">
                <div class="location">
                    <img src="img/background/vintage_car.jpg"/>
                    <p>
                        Location 1
                    </p>
                </div>
                <div class="location">
                    <img src="img/background/vintage_car.jpg"/>
                    <p>
                        Location 2
                    </p>
                </div>
                <div class="location">
                    <img src="img/background/vintage_car.jpg"/>
                    <p>
                        Location 3
                    </p>
                </div>
                <div class="location">
                    <img src="img/background/vintage_car.jpg"/>
                    <p>
                        Location 4
                    </p>
                </div>
                <div class="location">
                    <img src="img/background/vintage_car.jpg"/>
                    <p>
                        Location 5
                    </p>
                </div>
            </div>
        `;
    }
}
//define the custom element 'bluetac-grid' with the behaviour of the class 'Grid'
window.customElements.define('bluetac-location-grid', LocationGrid);
