<template>
  <div id="app">
    <div v-if=webcam id="cam"/><h1 v-if=webcam>This object is {{ predicted }} </h1>
    <button @click=startCam>Cam Up!</button>
    <app-header @openEditor="editorOpen = !editorOpen"></app-header>
    <app-note-editor v-if="editorOpen" @noteAdded="newNote" @noteDeleted="deleteNote"></app-note-editor>        
    <div class="noteContainer">
        <div v-for="(note, index) in notes" :key="`note-${index}`" class="note" :style="{'background-color': note.theme}">
            <div>
                <span class="delete" @click.prevent="deleteNote(index)"><i class="fas fa-times"></i></span> 
                <span >{{ note.title}}</span>
                <p class="note-text">{{ note.text }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import NoteEditor from './components/NoteEditor.vue';
import Header from './components/Header.vue';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

export default {
  name: 'App',
  data: function() {
    return {
      editorOpen: false,
      notes: [
        {
          title: 'Code',
          text: '1131111222',
          theme: '#FF8A80',
        },
        {
          title: 'event',
          text: 'event',
          theme: '#DDA0DD',
        },
      ],
      model:null,
      webcam:null,   
      predicted:"",   
    }
  },
	computed: {
		
	},
  methods: {   
    newNote(title, text, theme) {
      this.notes.push({title: title, text: text, theme: theme});
    },
    deleteNote(index) {
      this.notes.splice(index, 1)
    },    
    async loop() {
        this.webcam.update(); // update the webcam frame
        await this.predict();
        window.requestAnimationFrame(this.loop);
    },   
    async predict() {
        // predict can take in an image, video or canvas html element
        let prediction = await this.model.predictTopK(this.webcam.canvas,1,true);        
        this.predicted = prediction[0].className;
    },
    async startCam(){
        this.webcam = new tmImage.Webcam(200,200,true);
        await this.webcam.setup(); // request access to the webcam
        await this.webcam.play();
        document.getElementById("cam").appendChild(this.webcam.canvas);
        window.requestAnimationFrame(this.loop);
    }     
  },
     
  async mounted() {    
    if (localStorage.getItem('notes')) this.notes = JSON.parse(localStorage.getItem('notes'));
    let baseURL = 'https://teachablemachine.withgoogle.com/models/MZ4YFQ182/';
    this.model = await tmImage.load(baseURL+'model.json', baseURL+'metadata.json');
    let maxPredictions = this.model.getTotalClasses();
    console.log(maxPredictions);    
  },
  watch: {
    notes: {
      handler() {
        var newNotes = this.notes;
        localStorage.setItem('notes', JSON.stringify(newNotes));
      },
      deep: true,
    },
  },
  components: {
    appNoteEditor: NoteEditor,
    appHeader: Header
  }
}
</script>

<style lang="scss">
  @import '/styles/global.scss';
</style>
