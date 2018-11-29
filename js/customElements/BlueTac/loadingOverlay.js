//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

/*
class LoadingOverlay defines behaviour of the custom element
styleHooks:
    --bluetac-loading-overlay-color
    --bluetac-loading-overlay-text-shadow
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
    params: [string]attributeValue
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
                    color: var(--bluetac-loading-overlay-color, transparent);
                    text-shadow: var(--bluetac-loading-overlay-text-shadow, 0, 0, 0.2px, rgba(0,0,0,0.7));
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
            let $this = this;
            //if attribute disabled is set...
            if ($this.disabled) {
                //...hide the overlay and return
                $this.toggleOverlay();
                return;
            }

            //get all images from the doc root
            let imgs = document.images;
            //get the array lenght
            let len = imgs.length;
            let i = 0;

            if (len === 0) {
                $this.setOverlay(false);
            }

            //foreach image...
            [].forEach.call(imgs, (img) => {
                //...listen on the load event
                img.addEventListener('load', (e) => {
                    //if loading is complete incerement count var
                    i++;
                    console.log("Image loaded: " + i + "/" + len);
                    //if all images are loaded...
                    if (i===len) {
                        //...hide the loading overlay
                        $this.setOverlay(false);
                    }
                }, false);

                //if the image was laready loaded and served from cache...
                if (img.complete) {
                    //trigger the load event manually
                    img.dispatchEvent(new Event('load'));
                }
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

    /*
    sets the overlay
    params: [bool]value
    returns: -
    */
    setOverlay(value = false) {
        let overlay = this.shadowRoot.getElementById('overlay');
        overlay.style.display = (value ? "block" : "none")
    }
}
//define the custom element 'bluetac-loading-overlay' with the behaviour of the class 'LoadingOverlay'
window.customElements.define('bluetac-loading-overlay', LoadingOverlay);
