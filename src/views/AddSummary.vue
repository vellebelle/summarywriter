<template>
  <v-container>
    <v-row>
      <v-col md="8" sm="12">
        <v-radio-group v-model="profile" row>
          <v-radio label="Andre historier" value="Andre historier"></v-radio>
          <v-radio label="Prioriterede emner" value="Prioriterede emner"></v-radio>
          <v-radio label="Tophistorier" value="Tophistorier"></v-radio>
        </v-radio-group>

        <v-row>
          <v-col md="8" sm="12">
            <v-text-field label="Titel" v-model="title"></v-text-field>
          </v-col>
          <v-col md="4" sm="12">
            <v-select :items="categories" label="Kategori" v-model="category"></v-select>
          </v-col>
        </v-row>
        
        <div class="custom-toolbar mb-3">
          <v-btn @click="insertQuoteBreak" class="mr-3" small>[...]</v-btn>
          <v-btn @click="removeLineBreaks" class="mr-3" small>Remove line breaks</v-btn>
          <v-btn @click="decapitalizeSelection" small>Decapitalize</v-btn>
        </div>
        
        <VueTrix v-model="editorContent" placeholder="Skriv resumé..." ref="editor"/>

        <v-row align="center">
          <v-col cols="4">
            <v-select
              :items="media"
              label="Vælg avis"
              v-model="selectedPaper"
              :rules="mediumRules"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="weekdays"
              label="Vælg dag"
              v-model="selectedDay"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field label="Side" v-model="pageNumber"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn depressed color="primary" small @click="addSource"
              >Tilføj kilde</v-btn
            >
          </v-col>
        </v-row>
        <v-btn @click="addSummary" depressed color="primary" class="mt-4">Tilføj Resumé</v-btn>
      </v-col>
      <v-col md="4" sm="12" class="sources-list">
        <h3 class="mt-5 subtitle-1">Kilder</h3>
        <ul>
          <li v-for="(source, i) in sources" :key="i">
            <v-btn icon @click="deleteSource(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <span>{{ source.medium }}</span>
            <span v-if="source.day">, {{ source.day }}</span>
            <span v-if="source.pageNumber">, s. {{ source.pageNumber }}</span>
          </li>
        </ul>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueTrix from "vue-trix";
export default {
  name: "AddSummary",
  components: {
    VueTrix,
  },
  data: () => ({
    editor: null,
    editorContent: "",
    profile: "Andre historier",
    title: "",
    pageNumber: null,
    category: "",
    categories: [
      "Institutionelle anliggender",
      "Interne anliggender",
      "Retlige anliggender",
      "Finansielle anliggender",
      "Grundlæggende rettigheder",
      "Udenrigspolitik",
      "Socialpolitik",
      "Naboskabspolitik",
      "Arbejdsmarkedspolitik",
      "Sikkerhedspolitik",
      "Frihandelsaftale med USA",
      "Det digitale indre marked",
      "Udvidelse",
      "Økonomi",
      "Beskæftigelse, vækst og investeringer",
      "Landbrug",
      "Migration",
      "Handel",
      "Kultur",
      "Konkurrence",
      "Sundhed",
      "Klima",
      "Administration"
    ],
    media: [
      "Politiken",
      "Berlingske",
      "B.T.",
      "Jyllands-Posten",
      "Kristeligt Dagblad",
      "Information",
      "Ekstra Bladet",
      "Børsen",
      "Altinget",
      "Weekendavisen",
    ],
    selectedDay: null,
    weekdays: ["(Ingen)", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
    selectedPaper: "",
    sources: [],
    mediumRules: [
      v => !!v || "Vælg medie"
    ]
  }),
  methods: {
    addSource() {
      this.sources.push({
        medium: this.selectedPaper,
        pageNumber: this.pageNumber,
        day: this.selectedDay === "(Ingen)" ? null : this.selectedDay,
      });
      this.selectedDay = null;
      this.selectedPaper = null;
      this.pageNumber = null;
    },
    deleteSource(i) {
      this.sources.splice(i, 1);
    },
    addSummary() {
      this.$store.dispatch('addSingleSummaryToCollection', {
        title: this.title,
        category: this.category,
        profile: this.profile,
        summary: this.editorContent,
        sources: this.sources
      });
      this.resetForm();
      this.$router.push('Collection');
    },
    resetForm() {
      this.title = null;
      this.category = null;
      this.profile = null;
      this.editorContent = "";
      this.sources = [];
    },
    insertQuoteBreak() {
      this.editor.insertString("[...]");
    },
    removeLineBreaks() {
      const range = this.editor.getSelectedRange();
      let selection = this.editor.getDocument().getStringAtRange(range);
      // Remove line breaks
      selection = selection.replace(/(\r\n|\n|\r)/gm," ");
      // Remove double spaces
      selection = selection.replace(/\s+/g," ");
      this.editor.setSelectedRange(range);
      this.editor.insertString(selection);
    },
    decapitalizeSelection() {
      const range = this.editor.getSelectedRange();
      const selection = this.editor.getDocument().getStringAtRange(range);
      this.editor.setSelectedRange(range);
      this.editor.insertString(selection.toLowerCase());
    },
    onTrixChange(event) {
      console.log("Changed", event);
    },
    onTrixPaste(event) {
      console.log("Pasted!", event);
    },
  },
  mounted() {
    this.editor = this.$refs.editor.$refs.trix.editor;
    document.addEventListener("trix-change", this.onTrixChange);
    document.addEventListener("trix-paste", this.onTrixPaste);
  },
  beforeDestroy() {
    document.removeEventListener("trix-change", this.onTrixChange);
    document.removeEventListener("trix-paste", this.onTrixPaste);
  },
};
</script>

<style>
.trix-content {
  height: 350px;
  overflow-y: auto;
}
.sources-list ul {
  list-style-type: none;
  padding: 0;
}
#trix-toolbar-1 {
  display: none;
}
.trix-button-row {
  display: none;
}
em {
  background: yellow;
  font-style: normal;
}
</style>
