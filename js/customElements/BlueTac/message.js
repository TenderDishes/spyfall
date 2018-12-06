//check if customElements and ShadowDOM is supported/enabled
if (!(window.customElements && document.body.attachShadow)) {
    console.log("Shadow DOM or Custom Elements v1 not supported!");
}

class Message extends HTMLElement {
    //listen for changes of the given attributes and automatically call attributeChangedCallback()
    static get observedAttributes() {
        return ['type'];
    }

    get noticeType() {
        return this.hasAttribute('type');
    }

    set noticeType(val) {
        this.setAttribute('type', val);
    }

    constructor() {
        super();

        let shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = `
            <style>
                .message {
                    width: 100%;
                    margin: 10px 0;
                }

                .message.error .wrapper {
                    text-shadow: 0 0 2px red;
                    box-shadow: 0 0 5px red;
                    border: 1px solid #f66;
                    color: red;
                }

                .message .wrapper {
                    border: 1px solid black;
                    padding: 10px 30px 10px 10px;
                    box-shadow: 0 0 5px black;
                    font-size: 20px;
                    font-weight: bold;
                }

                .message .wrapper .close {
                    position: relative;
                    float: right;
                    margin-right: -20px;
                    text-decoration: none;
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                }

                .message .wrapper .close::before,
                .message .wrapper .close::after {
                    content: ' ';
                    width: 20px;
                    position: absolute;
                    left: 0;
                    top: 10px;
                    height: 4px;
                    background-color: black;
                    box-shadow: 0 0 5px black;
                }

                .message.error .wrapper .close::before,
                .message.error .wrapper .close::after {
                    background-color: red;
                    box-shadow: 0 0 5px red;
                }

                .message .wrapper .close::before {
                    transform: rotateZ(45deg);
                }

                .message .wrapper .close::after {
                    transform: rotateZ(-45deg);
                }

                .message .wrapper .close:active {
                    border-width: 1px;
                    border-style: inset;
                }
            </style>

            <div class="message">
                <div class="wrapper">
                    <span>
                        <slot>No information given.</slot>
                    </span>
                    <a class="close" href="#"></a>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.close').addEventListener('click', this.removeSelf.bind(this));
    }

    removeSelf() {
        this.parentNode.removeChild(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type') {
            if(oldValue) {
                this.shadowRoot.querySelector('.message').classList.toggle(oldValue);
            }
            if(newValue) {
                this.shadowRoot.querySelector('.message').classList.toggle(newValue);
            }
        }
    }
}

window.customElements.define('bluetac-message', Message);
