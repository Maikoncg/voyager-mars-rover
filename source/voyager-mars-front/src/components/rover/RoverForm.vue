<template>
  <v-dialog
    v-model="renderDialog"
    scrollable
    persistent
    max-width="500px"
    content-class="rover-form"
    @keydown.esc="close()">
    <v-card>
      <v-card-title class="elevation-0 grey lighten-4">
        {{ rover.id ? 'Edit' : 'New'}} Rover
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-form ref="form" lazy-validation>
              <v-col cols="12">
                <v-text-field
                  label="Code"
                  v-model="rover.code"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  v-model="rover.name"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Description"
                  v-model="rover.description">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Location"
                  v-model="rover.location"
                  :rules="[rules.required]">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  :search-input.sync="filterCompanies"
                  v-model="rover.company"
                  :items="companies"
                  label="Companies"
                  item-text="name"
                  :rules="[rules.required]"
                  return-object>
                </v-autocomplete>
              </v-col>
            </v-form>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="elevation-0 px-6 pb-4">
        <v-btn color="blue accent-3" outlined dark depressed @click="close()" :disabled="loading">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" depressed @click="saveRover()" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import roverAPI from '@/api/rover';
import companyAPI from '@/api/company';

export default {
  props: {
    showDialog: Boolean,
    value: Object,
  },

  data: () => ({
    obrigatorioRegra: [v => !!v || 'Campo obrigatório'],
    renderDialog: true,
    rover: null,
    rules: {
      required: value => !!value || 'Required.',
    },
    loading: false,
    companies: [],
    search: '',
    filterCompanies: null,
  }),

  created() {
    this.fetchCompanys();
    this.rover = Object.assign({}, this.value);
  },

  watch: {
    filterCompanies(company) {
      if (!company && this.rover.company_id) {
        delete this.rover.company_id;
      }
    },
  },

  methods: {
    close() {
      this.$emit('showDialog', false);
    },

    async fetchCompanys() {
      this.loading = true;
      try {
        const { data: companies } = await companyAPI.fetch({ search: this.search });
        this.companies = companies;
      } catch (error) {
        this.$store.commit('SET_MESSAGE', 'None companies found.');
      } finally {
        this.loading = false;
      }
    },

    async saveRover() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          if (!this.value.id) {
            this.rover.coordinate_x = 0;
            this.rover.coordinate_y = 0;
            this.rover.direction = 'N';
            this.rover.company_id = this.rover.company.id;
            const response = await roverAPI.create(this.rover);
            const companyTable = this.rover.company;
            this.rover = response.data;
            this.rover.company = companyTable;
            Object.assign(this.value, this.rover);
            this.$emit('new:rover');
          } else {
            this.rover.company_id = this.rover.company.id;
            await roverAPI.update(this.rover.id, this.rover);
            Object.assign(this.value, this.rover);
          }
        } catch (error) {
          this.$store.commit('SET_MESSAGE', 'Error saving/updating rover.');
        } finally {
          this.loading = false;
        }

        this.close();
      }
    },
  },
};
</script>

<style>
  .rover-form form {
    width: 100%;
  }
</style>
