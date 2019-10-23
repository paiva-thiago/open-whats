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
<a class="github-fork-ribbon" href="https://url.to-your.repo" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
  <Head titulo={tit}/>
  <Phone bind:ddi={ddi} bind:phone={phone}/>
  <Button open={abreZap} />
  
</main>
