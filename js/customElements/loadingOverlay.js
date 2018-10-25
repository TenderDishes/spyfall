//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class LoadingOverlay defines behaviour of the custom element
styleHooks:
    --loading-overlay-color
    --loading-overlay-text-shadow
*/
class LoadingOverlay extends HTMLElement {
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
                #overlay {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    z-index: 100;
                    background-color: rgba(0, 0, 0, 0.95);
                }
                .center {
                    position: fixed;
                    top: 50vh;
                    left: 50vw;
                    text-align: center;
                    transform: translate(-50%,-50%);
                    background-color: rgba(255, 255, 255, 0.66);
                    padding: 10px;
                    box-shadow: 0 0 15px 10px grey;;
                    color: var(--loading-overlay-color, transparent);
                    text-shadow: var(--loading-overlay-text-shadow, 0, 0, 0.2px, rgba(0,0,0,0.7));
                }
            </style>
            <div id="overlay">
                <span class="center">
                    <!-- the slot for the text -->
                    <slot></slot>
                </span>
            </div>
        `;

        //when the dom content is loaded
        document.addEventListener('DOMContentLoaded', e => {
            //if attribute disabled is set...
            if (this.disabled) {
                //...hide the overlay and return
                this.toggleOverlay();
                return;
            }

            //get all images from the doc root
            let imgs = document.images;
            //get the array lenght
            let len = imgs.length;
            let i = 0;

            //foreach image...
            [].forEach.call(imgs, function(img) {
                //...listen on the load event
                img.addEventListener('load', () => {
                    //if loading is complete incerement count var
                    i++;
                    //if all images are loaded...
                    if (i===len) {
                        //...hide the loading overlay
                        document.getElementsByTagName("loading-overlay")[0].toggleOverlay();
                    }
                }, false);
            });
        }, false);
    }

    /*
    toggle the overlay
    params: -
    returns: -
    */
    toggleOverlay() {
        let overlay = this.shadowRoot.getElementById('overlay');
        if(overlay.style.display === "none") {
            overlay.style.display = "block"
        } else {
            overlay.style.display = "none"
        }
    }
}
//define the custom element 'loading-overlay' with the behaviour of the class 'LoadingOverlay'
window.customElements.define('loading-overlay', LoadingOverlay);
