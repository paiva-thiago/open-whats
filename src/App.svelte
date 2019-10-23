<script>
  import Button   from './Button.svelte'
  import Phone    from './Phone.svelte'
  import Head     from './Head.svelte'
  let tit   = 'OpenWhats';
  let ddi   = '';
  let phone = '';
  const abreZap = ()=>{
    if((ddi.trim()!='')&&(phone.trim()!='')){
      window.open(`https://api.whatsapp.com/send?phone=${ddi}${phone}`);       
    } 
  }
</script>

<svelte:head>
	<title>{tit}</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css" />
</svelte:head>
<style>
	.box{
		width:75%;
		margin:0 auto;
		border: 1px solid #000;
		background-color: #000;
		color: #FFF;
		font-family: monospace;
		
		}
</style>
<main>
<a class="github-fork-ribbon" href="https://github.com/paiva-thiago/open-whats" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
  <Head titulo={tit}/>
  <div class="bg-teal-100 border-t border-b border-teal-500 text-teal-700 px-4 py-3 top-100 pb-100" role="alert">
	  <p class="font-bold">VOCÊ</p>
	  <p class="text-sm">Já precisou mandar aquele zap pra aquele contato que você não quer adicionar??</p>
	  <p class="text-sm">SEUS PROBLEMAS ACABARAM! - Chegou o OpenWhats! Selecione o código do país e preencha com o DDD + número, que o OpenWhats abre pra você!</p>
	</div>  
 <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <Phone bind:ddi={ddi} bind:phone={phone}/>
  <Button open={abreZap} />
  </div>
</main>

