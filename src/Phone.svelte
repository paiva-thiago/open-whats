<script>
    import 'flag-icon-css/css/flag-icon.css'
    export let ddi=''
    export let phone=''
    import {Ddi} from './res/ddi.js'
    let ddiList = Ddi.ddiList
</script>
<style>
    .select-fake{
        color:#888;
        width:250px;
        height:42px;        
        vertical-align:middle;
        position:relative;
        background:white;
        border:1px solid #ccc;
        border-radius:5px;
        overflow:hidden;
        
        padding:0.5rem 0.75rem;
        line-height: 1.8;
        margin-top: .25rem; 
        -moz-appearance: none;
        appearance: none;
        background-color:
        #fff;
        border-color:
        #e2e8f0;
        border-width: 1px;
        border-radius: .25rem;
    }
    .select-fake::after {
        content:"▼";
        font-size:0.5em;
        font-family:arial;
        position:absolute;
        top:50%;
        right:5px;
        transform:translate(0, -50%);
    }
    .select-fake input{
        display:none;
    }
    .wafield{
        float:left;
    }


</style>
     <div class="wafield select-fake" >        
        <div class="options-fake ">
        {#each ddiList as iCountry}
            <div class="option-fake">
                <input type="radio" name="ddi"  id="opt-{iCountry.cdCountry}" bind:group={ddi} value={iCountry.cdCountry}/>
                <label for="opt-{iCountry.cdCountry}"><span class="flag-icon flag-icon-{iCountry.isoCountry}"></span>{iCountry.nmCountry}</label>
            </div>
        {/each}
        </div>
    </div>


<input bind:value={phone} class="wafield form-input mt-1 w-1000 " id="tel" type="tel" placeholder="Phone" size="9">{ddi}