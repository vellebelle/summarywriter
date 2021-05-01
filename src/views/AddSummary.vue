<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <VueTrix
          v-model="editorContent"
          placeholder="Enter content"
          localStorage
        />
      </v-col>
      <v-col cols="4">
        <h3>Other settings</h3>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
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
    editorContent: "",
  })
};
</script>
