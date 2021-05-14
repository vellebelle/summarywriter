<template>
  <v-container>
    <v-row>
      <v-col md="8" sm="12">
        <v-radio-group v-model="profile" row>
          <v-radio label="Andre" value="andre"></v-radio>
          <v-radio label="Prioriterede Emner" value="prio"></v-radio>
          <v-radio label="Top Nyheder" value="top"></v-radio>
        </v-radio-group>

        <v-row>
          <v-col md="8" sm="12">
            <v-text-field label="Titel" v-model="title"></v-text-field>
          </v-col>
          <v-col md="4" sm="12">
            <v-select :items="categories" label="Kategori" v-model="category"></v-select>
          </v-col>
        </v-row>

        <VueTrix v-model="editorContent" placeholder="Skriv resumé..." />

        <v-row align="center">
          <v-col cols="4">
            <v-select
              :items="papers"
              label="Vælg avis"
              v-model="selectedPaper"
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
        <h3>Test Summaries</h3>
        {{ summaries }}
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
    editorContent: "",
    profile: "andre",
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
    ],
    papers: [
      "Politiken",
      "Berlingske",
      "BT",
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
    summaries: []
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
      // Sources needs to get organised
      this.summaries.push({
        title: this.title,
        category: this.category,
        profile: this.profile,
        summary: this.editorContent,
        sources: this.sources
      });
      this.resetForm();
    },
    resetForm() {
      this.title = null;
      this.category = null;
      this.profile = null;
      this.editorContent = "";
      this.sources = [];
    },
    onTrixChange(event) {
      console.log("Changed", event);
    },
    onTrixPaste(event) {
      console.log("Pasted!", event);
    },
  },
  mounted() {
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
}
.sources-list ul {
  list-style-type: none;
  padding: 0;
}
</style>
