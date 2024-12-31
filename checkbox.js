class Checkbox extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode:'open'});
        this.shadow.innerHTML = "<style>div, svg, label { vertical-align: middle;}label {display: inline-block;margin-left: 5px;</style><div><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path /></svg><label></label></div>";
        this._checked = false;

        this.addEventListener("click", this.onClickHandler.bind(this));
    }

    set checked(value) {
        if(value != this._checked) {
            this._checked = value;
            this.update();
        }
    }

    get checked() {
        return this._checked
    }

    onClickHandler(event) {
        this.checked = !this.checked;
    }

    update() {
        let svg = this.shadow.querySelector("svg");

        if(this._checked)
            svg.querySelector("path").setAttribute("d", "M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z");
        else
            svg.querySelector("path").setAttribute("d", "M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z");    
    }

    connectedCallback() {
        this.update();
        if(this.hasAttribute("checked"))
            this.checked = true;
        else
            this.checked = false;
    }

}

customElements.define("custom-checkbox", Checkbox);