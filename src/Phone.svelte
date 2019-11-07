<script>
    import { fly,fade } from 'svelte/transition';
    import 'flag-icon-css/css/flag-icon.css'
    export let ddi=''
    export let phone=''
    import {Ddi} from './res/ddi.js'
    let country = {"cdCountry":"00","nmCountry":"None(nenhum)","isoCountry":"un"};
    let ddiList = Ddi.ddiList
    let findCountry = async (code)=>{
        const search = ddiList.filter((x)=>x.cdCountry===code)
        if(search.length>0){
            return search[0];
        }
        return {"cdCountry":"00","nmCountry":"notFound","isoCountry":"un"};
    }
    let retornaPais = async(code)=>{
        country = await findCountry(code)
    }
    let visible = false;
    let clickList = ()=>{visible=true}
    let clickCountry = async()=>{
        country = await findCountry(ddi)
        visible=false
    }
    let close = ()=>{visible=false;}

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
        background-color:#fff;
        border-color:#e2e8f0;
        border-width: 1px;
        border-radius: .25rem;
    }
    .select-fake::after {
        content:"🔍";
        font-size:1.5em;
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
    .options-fake{        
        position: absolute;
        left:10vw;
        width: 80vw;
        top:5vh;        
        height:90vh;
        background-color:#fff;
        border-color: #e2e8f0;
        border-width: 1px;
        border-radius: .55rem;        
        overflow:auto;
        opacity:1;
    }
    @media (min-width: 700px) {
        .options-fake{
            left:12vw;
            width:75vw;
            top:25vh;
            height:50vh;
            
        }
    }
    label{
        width:100%;
        display:block
    }
    .option-fake{
        border-bottom-color: #e2e8f0;
    }
    .option-fake:hover{
        background-color: #e2e8f0;
    }
    input[type=radio]{
        display:none;
    }
    
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        opacity: 0.5;
        transition: opacity 1s;
        background-color:#000
    }
</style>
     <div class="wafield select-fake" on:click={clickList}>        
        <div class="option-fake selected">
            <input type="radio" name="ddi"  id="opt-{country.cdCountry}" bind:group={ddi} value={country.cdCountry}/>
            <label for="opt-{country.cdCountry}"><span class="flag-icon flag-icon-{country.isoCountry}"></span>{country.nmCountry}</label>
        </div>        
    </div>
    {#if visible}
        <div class="background" on:click={close}>&nbsp;</div>
            <div class="options-fake " in:fly out:fade>
                {#each ddiList as iCountry}
                    <div class="option-fake">
                        <input type="radio"  name="ddi"  id="opt-{iCountry.cdCountry}"  value={iCountry.cdCountry} bind:group={ddi} on:change={clickCountry}/>
                        <label for="opt-{iCountry.cdCountry}"><span class="flag-icon flag-icon-{iCountry.isoCountry}"></span>{iCountry.nmCountry}</label>
                    </div>
                {/each}
            
        </div>
    {/if}

<input bind:value={phone} class="wafield form-input mt-1 w-1000 " id="tel" type="tel" placeholder="Phone" size="9">