await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

//gather elements

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider1 = document.getElementById("slide1")
let slider2 = document.getElementById("slide2")

//Update Slider

slider1.addEventListener("change", function(){
     document.getElementById("harmony1amt").innerText=`${slider1.value} semitones`
})
slider2.addEventListener("change", function(){
    document.getElementById("harmony2amt").innerText=`${slider2.value}`
})
//input & output dropdown

WebMidi.inputs.forEach(function (input, num){
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`
})
WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });

  // change event listener

  dropIns.addEventListener("change", function (){
    if(myInput.hasListener("noteon")){
        myInput.removeListener("noteon")
    }
    if(myInput.hasListener("noteoff")){
        myInput.removeListener("noteoff")
    }
  })

  myInput=WebMidi.inputs[dropIns.value]
  myOutput=WebMidi.outputs [dropOuts.value]

  //oct

  const octave = function (midiInput){
    let root = midiInput.note.number;
    let octavevalue = midiInput.note.number + parseInt(slider1.value);
    let velocity = midiInput.note.rawAttack

    let rootOut= new Note (root, {rawAttack: velocity});
    let octOut= new Note (octavevalue, {rawAttack: velocity});
    return(rootOut, octOut)
    
  };

  //note on/off listener

  myInput.addListener("noteon", function(midiValue){
    myOutput.sendNoteOn(octave(midiValue));
  });

  myInput.addListener("noteoff", function (midiValue){
    myOutput.sendNoteOff(octave(midiValue))
  });

  dropOuts.addEventListener("change", function (){
    myOutput = WebMidi.outputs[dropOuts.value].channels[1]
  })