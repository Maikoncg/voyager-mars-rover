<template>
  <div class="RoverTable">
    <v-card flat>
      <div class="d-flex pb-6">
        <v-btn color="success" dark depressed @click="newRover()">Create New</v-btn>
        <v-spacer/>
        <v-layout d-flex justify-end>
          <v-flex xs6>
            <v-text-field
              label="Search"
              v-model="search"
              append-icon="mdi-magnify"
              single-line
              hide-details
            />
          </v-flex>
        </v-layout>
      </div>
      <v-data-table
        :headers="headers"
        :items="rovers"
        :items-per-page="10"
        :search="search"
        :options="options"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editRover(item)">
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteRover(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <RoverForm
      v-if="showRoverDialog"
      v-model="currentRover"
      @showDialog="showRoverDialog = $event"
      @new:rover="newRoverHandler()"
    ></RoverForm>
  </div>
</template>

<script>
  import api from '@/api/rover';

  import RoverForm from '@/components/rover/RoverForm.vue';

  export default {
    components: { RoverForm },

    data: () => ({
      rovers: [],
      rover: {},
      headers: [
        {
          text: 'Code',
          value: 'code',
          align: 'start',
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Location',
          value: 'location',
        },
        {
          text: 'Company',
          value: 'company.name',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
      ],
      loading: false,
      search: '',
      options: {
        sortBy: ['code'],
      },
      showRoverDialog: false,
      currentRover: {},
    }),

    created() {
      this.fetch();
    },

    methods: {
      async fetch() {
        this.loading = true;
        try {
          const { data: rovers } = await api.fetch();
          this.rovers = rovers;
        } catch (error) {
          this.$store.commit('SET_MESSAGE', 'None rovers found.');
        } finally {
          this.loading = false;
        }
      },
      newRover() {
        this.currentRover = {};
        this.showRoverDialog = true;
      },
      newRoverHandler() {
        this.rovers.push(this.currentRover);
      },
      editRover(rover) {
        this.currentRover = rover;
        this.showRoverDialog = true;
      },
      async deleteRover(rover) {
        try {
          this.loading = true;
          await api.delete(rover.id);
          this.rovers.splice(this.rovers.indexOf(rover), 1);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', 'Error deleting rover');
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
