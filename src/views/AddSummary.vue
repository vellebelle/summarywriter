<template>
  <v-container>
    <v-row>
      <v-col md="8" sm="12">
        <v-form ref="mainForm" lazy-validation v-model="mainFormValid">
          <v-radio-group v-model="profile" row required>
            <v-radio label="Andre historier" value="3"></v-radio>
            <v-radio label="Prioriterede emner" value="2"></v-radio>
            <v-radio label="Tophistorier" value="1"></v-radio>
          </v-radio-group>

          <v-row>
            <v-col md="8" sm="12">
              <v-text-field
                label="Titel"
                :rules="titleRules"
                v-model="title"
              ></v-text-field>
            </v-col>
            <v-col md="4" sm="12">
              <v-select
                :items="categories"
                :rules="categoryRules"
                label="Kategori"
                v-model="category"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>

        <div class="custom-toolbar mb-3">
          <v-btn @click="insertQuoteBreak" class="mr-3" small>[...]</v-btn>
          <v-btn @click="removeLineBreaks" class="mr-3" small
            >Remove line breaks</v-btn
          >
          <v-btn @click="decapitalizeSelection" small>Decapitalize</v-btn>
        </div>

        <VueTrix
          v-model="editorContent"
          placeholder="Skriv resumé..."
          ref="editor"
        />

        <v-row align="center">
          <v-col cols="4">
            <v-form lazy-validation ref="sourceForm" v-model="sourceFormValid">
              <v-select
                required
                :items="media"
                label="Vælg avis"
                v-model="selectedPaper"
                :rules="mediumRules"
              ></v-select>
            </v-form>
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
        <v-btn @click="addSummary" depressed color="primary" class="mt-4"
          >Tilføj Resumé</v-btn
        >
        <v-btn @click="highlightKeywords">Show</v-btn>
        <v-btn @click="removeHighlightsFromEditor">Hide</v-btn>
        
        


        <div class="red--text mt-3">{{ noSourcesErrorText }}</div>
      </v-col>
      <v-col md="4" sm="12" class="sources-list">
        <v-switch v-model="showKeywords" label="Markér forkortelser mv."></v-switch>
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
    profile: "3",
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
      "Administration",
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
    weekdays: [
      "Ingen",
      "Mandag",
      "Tirsdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lørdag",
      "Søndag",
    ],
    selectedPaper: "",
    sources: [],
    sourceFormValid: true,
    mediumRules: [(v) => !!v || "Vælg medie"],
    noSourcesErrorText: "",
    mainFormValid: true,
    titleRules: [(v) => !!v || "Indtast en titel"],
    categoryRules: [(v) => !!v || "Vælg en kategori"],
    showKeywords: false,
    keywords: [
      "»",
      "«",
      "hhv.",
      "mio.",
      "mia.",
      "bl.a.",
      "pct.",
      "%",
      "kr.",
      "f.eks.",
      "ca."
    ],
  }),
  methods: {
    addSource() {
      if (this.$refs.sourceForm.validate()) {
        this.sources.push({
          medium: this.selectedPaper,
          pageNumber: this.pageNumber,
          day: this.selectedDay === "(Ingen)" ? null : this.selectedDay,
        });
        // Reset values
        this.selectedDay = null;
        this.selectedPaper = null;
        this.pageNumber = null;

        // Reset form and error msg
        this.noSourcesErrorText = "";
        this.$refs.sourceForm.reset();
      }
    },
    deleteSource(i) {
      this.sources.splice(i, 1);
    },
    addSummary() {
      // ALso check if any sources..

      if (this.$refs.mainForm.validate()) {
        // Check if there are sources added
        if (this.sources.length === 0) {
          this.noSourcesErrorText = "Husk at tilføje mindst een kilde";
          return;
        }
        this.$store.dispatch("addSingleSummaryToCollection", {
          title: this.title,
          category: this.category,
          profile: this.profile,
          summary: this.removeHighlights(this.editorContent),
          sources: this.sources,
        });
        this.$refs.mainForm.reset();
        this.noSourcesErrorText = "";
        this.$router.push("Collection");
      }
    },
    insertQuoteBreak() {
      this.editor.insertString("[...]");
    },
    removeLineBreaks() {
      const range = this.editor.getSelectedRange();
      let selection = this.editor.getDocument().getStringAtRange(range);
      // Remove line breaks
      selection = selection.replace(/(\r\n|\n|\r)/gm, " ");
      // Remove double spaces
      selection = selection.replace(/\s+/g, " ");
      this.editor.setSelectedRange(range);
      this.editor.insertString(selection);
    },
    decapitalizeSelection() {
      const range = this.editor.getSelectedRange();
      const selection = this.editor.getDocument().getStringAtRange(range);
      this.editor.setSelectedRange(range);
      this.editor.insertString(selection.toLowerCase());
    },
    removeFormattingOnPaste(event) {
      const div = document.createElement("div");

      if (event.paste.string) {
        div.innerHTML = event.paste.string;
      }
      if (event.paste.html) {
        div.innerHTML = event.paste.html;
      }

      let text = div.textContent || div.innerText || "";
      text = text.replace(/\n/g, "");
      //console.log(text);

      // Undo the paste
      event.target.editor.undo();
      // Insert text
      event.target.editor.insertString(text);
    },
    highlightKeywords() {
      this.keywords.forEach((word) => {
        console.log(word);
        this.editorContent = this.editorContent.replaceAll(word, `<em>${word}</em>`);
      });
      //this.editor.insertString(text);
      
    },
    removeHighlightsFromEditor() {
      this.editorContent = this.editorContent.replaceAll('<em>', '').replaceAll('</em>', '');
    },
    removeHighlights(text) {
      return text.replaceAll('<em>', '').replaceAll('</em>', '');
    },
    onTrixPaste(event) {
      this.removeFormattingOnPaste(event);
    },
    onTrixChange(event) {
      console.log("Changed", event);
    },
  },
  watch: {
    showKeywords(val) {
      if (val) {
        this.highlightKeywords();
      } else {
        this.removeHighlightsFromEditor();
      }
    }
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
  display: none !important;
}
em {
  background: rgb(92, 232, 199);
  font-style: normal;
}

</style>
