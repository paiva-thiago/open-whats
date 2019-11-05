<style>

.select-sim {
    color:#000;
  width:200px;
  height:22px;
  line-height:22px;
  vertical-align:middle;
  position:relative;
  background:white;
  border:1px solid #ccc;
  overflow:hidden;
}

.select-sim::after {
  content:"▼";
  font-size:0.5em;
  font-family:arial;
  position:absolute;
  top:50%;
  right:5px;
  transform:translate(0, -50%);
}

.select-sim:hover::after {
  content:"";
}

.select-sim:hover {
  overflow:visible;
}

.select-sim:hover .options .option label {
  display:inline-block;
}

.select-sim:hover .options {
  background:white;
  border:1px solid #ccc;
  position:absolute;
  top:-1px;
  left:-1px;
  width:100%;
  height:88px;
  overflow-y:scroll;
}

.select-sim .options .option {
  overflow:hidden;
}

.select-sim:hover .options .option {
  height:22px;
  overflow:hidden;
}

.select-sim .options .option img {
  vertical-align:middle;
}

.select-sim .options .option label {
  display:none;
}

.select-sim .options .option input {
  width:0;
  height:0;
  overflow:hidden;
  margin:0;
  padding:0;
  float:left;
  display:inline-block;
  /* fix specific for Firefox */
  position: absolute;
  left: -10000px;
}

.select-sim .options .option input:checked + label {
  display:block;
  width:100%;
}

.select-sim:hover .options .option input + label {
  display:block;
}

.select-sim:hover .options .option input:checked + label {
  background:#fffff0;
  color:red;
}
</style>
<div class="select-sim" id="select-color">
  <div class="options">
    <div class="option">
      <input type="radio" name="color" value="" id="color-" checked />
      <label for="color-">
        <img src="http://placehold.it/22/ffffff/ffffff" alt="" /> Select an option
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="red" id="color-red" />
      <label for="color-red">
        <img src="http://placehold.it/22/ff0000/ffffff" alt="" /> Red
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="green" id="color-green" />
      <label for="color-green">
        <img src="http://placehold.it/22/00ff00/ffffff" alt="" /> Green
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="blue" id="color-blue" />
      <label for="color-blue">
        <img src="http://placehold.it/22/0000ff/ffffff" alt="" /> Blue
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="yellow" id="color-yellow" />
      <label for="color-yellow">
        <img src="http://placehold.it/22/ffff00/ffffff" alt="" /> Yellow
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="pink" id="color-pink" />
      <label for="color-pink">
        <img src="http://placehold.it/22/ff00ff/ffffff" alt="" /> Pink
      </label>
    </div>
    <div class="option">
      <input type="radio" name="color" value="turquoise" id="color-turquoise" />
      <label for="color-turquoise">
        <img src="http://placehold.it/22/00ffff/ffffff" alt="" /> Turquoise
      </label>
    </div>
  </div>
</div>