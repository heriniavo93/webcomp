const MAIN_STYLE = `
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
}

.form-container{
    background-color: #fff;
    border-radius: 5px;
    width: 500px;
    max-width: 100%;
    overflow: hidden;
}

.form-header{
    background-color: #f7f2f2;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
}

.form-main{
    padding: 20px;
}

.form-control{
    margin-bottom: 10px;
    padding-bottom: 20px;
    position: relative;
}



.form-control label{
    display: inline-block;
    margin-bottom: 5px;
    cursor:pointer;
}


.form-control input, textarea, select{
    display: block;
    font-size: 14px;
    font-family: inherit;
    padding: 10px;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    min-height: 40px!important;
    border-width: 1px;
    cursor: pointer;
    appearance: none;
    border-radius: 4px;
}

.form-control input:focus, textarea:focus, select:focus{
    border-color: cadetblue;
    outline: none;
    appearance: none;
    border-radius: none;
}

.form-control small{
    visibility: hidden;
    position: absolute;
    top: 35px;
    right: 10px;
}


.form-control .error-message{
    visibility: hidden;
    font-size: small;
}

.form-main button{
    padding: 10px;
    font-family: inherit;
    font-size: 16px;
    display: block;
    width: 100%;
    cursor: pointer;
}

.form-control.success input,.form-control.success textarea,.form-control.success select{
    border-color: #2ecc2e;
}

.form-control.success .check-success{
    color: #2ecc2e;
    visibility: visible;
}

.form-control.error .check-error, .form-control.error .error-message{
    color: #f05121;
    visibility: visible;
}

.form-control.error input, .form-control.error textarea,.form-control.error select{
    border-color: #f05121;
}
`

class ItemForm extends HTMLElement{
    constructor(){
        // Call super constructor
        super()

        // Utils variables
        this.item = null

        // Attach shadow
        this.attachShadow({mode: "open"})
    }

    update(){
        // Attach style
        this.shadowRoot.innerHTML = ""
        const style = document.createElement("style")
        style.textContent = MAIN_STYLE
        this.shadowRoot.appendChild(style)

        const keyType = this.getAttribute("type")
        if(keyType == null || !ItemForm.objects.has(keyType)){
            keyType = "text"
            this.setAttribute("type", keyType)
        }

        // Get template with this key
        const template = ItemForm.objects.get(keyType)
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.item = this.shadowRoot.querySelector(".form-control")
        
        // Set attributes
        for(let attr of HTMLElement.observedAttributes){
            if(this.getAttribute(attr) == null)
                continue

            if(attr == "status"){
                const className = this.getAttribute(attr)
                if(className != null && className != "")
                    this.item.classList.add(className)
            }else if(attr == "label")
                this.item.querySelector("label").innerText = this.getAttribute(attr)
            else if(attr == "name")
                this.item.children[1].setAttribute(attr, this.getAttribute(attr))
            else if(attr == "error"){
                this.item.querySelector(".error-message").innerText = this.getAttribute(attr)
            }
            else if(attr  == "options" && keyType == "select"){
                try {
                    const options = JSON.parse(this.getAttribute(attr));
                    const defaultOption = document.createElement("option")
                    defaultOption.innerHTML = "<option hidden disabled selected value></option>"
                    
                    let defaultIndex = null
                    try{
                        defaultIndex = options["default"] == null ? -1 : parseInt(options["default"])
                        if(defaultIndex < 0 || defaultIndex >= options["data"].length){
                            this.item.children[1].appendChild(defaultOption)        
                            defaultIndex = null
                        }
                    }catch(error){
                        this.item.children[1].appendChild(defaultOption)
                        defaultIndex = null
                    }

                    let cnt = 0
                    for(let [value, displayText] of options["data"]){
                        const opt = document.createElement("option")
                        opt.value = value
                        opt.textContent = displayText
                        if(defaultIndex && defaultIndex == cnt)
                            opt.selected = true

                        this.item.children[1].appendChild(opt)

                        cnt++
                    }
                } catch (error) {
                    // alert(error)
                }
            }
        }

        this.shadowRoot.appendChild(this.item)
    }

    connectedCallback(){
        // Attach style
        this.update()
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.update()
    }

    disconnectedCallback(){
        
    }
}

// Liste des attributs
HTMLElement.observedAttributes = ["type", "name", "label", "error", "placeholder", "status", "options", "options-default"]
ItemForm.style = document.createElement("style")
ItemForm.style.textContent = MAIN_STYLE
ItemForm.textIput = document.createElement("template")
ItemForm.textIput.innerHTML = `
<div class="form-control">
    <label for="name">Example</label>
    <input type="text" name="name" id="name" placeholder="type here">
    <small class="check-success">&#x2713;</small>
    <small class="check-error">&#33;</small>
    <span class="error-message">Error message</span>
</div>
`

ItemForm.emailInput = document.createElement("template")
ItemForm.emailInput.innerHTML = `
<div class="form-control">
    <label for="name">Example</label>
    <input type="email" name="name" id="name" placeholder="type here">
    <small class="check-success">&#x2713;</small>
    <small class="check-error">&#33;</small>
    <span class="error-message">Error message</span>
</div>
`

ItemForm.selectIput = document.createElement("template")
ItemForm.selectIput.innerHTML = `
<div class="form-control">
    <label for="name">Username</label>
    <select name="name" id="name">
    </select>
    <small class="check-success">&#x2713;</small>
    <small class="check-error">&#33;</small>
    <span class="error-message">Error message</span>
</div>
`

ItemForm.textAreaInput = document.createElement("template")
ItemForm.textAreaInput.innerHTML = `
<div class="form-control">
    <label for="name">Username</label>
    <textarea name="name" id="name"></textarea>
    <small class="check-success">&#x2713;</small>
    <small class="check-error">&#33;</small>
    <span class="error-message">Error message</span>
</div>
`

ItemForm.objects = new Map([
    ["text", ItemForm.textIput],
    ["email", ItemForm.emailInput],
    ["select", ItemForm.selectIput],
    ["textarea", ItemForm.textAreaInput]
])

class ContainerForm extends HTMLElement{
    constructor(){
        // Call super constructor
        super()

        // Attach shadow
        this.attachShadow({mode: "open"})

        // Create the element
        

    }
}


ContainerForm.template = document.createElement("template")
ContainerForm.template.innerHTML = `

`


// Serve components
customElements.define("custom-form", ContainerForm)
customElements.define("form-control", ItemForm)
