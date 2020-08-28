<template>
	<v-row dense>
		<v-col cols="3">
			<v-autocomplete
        @input="fetchCompanies"
        v-model="company"
        :items="companies"
        label="Companies"
        item-text="name"
        return-object
      />
		</v-col>
		<v-col v-show="company.id" cols="3">
			<v-autocomplete
        v-model="rover"
        :items="rovers"
        label="Rovers"
        item-text="name"
        return-object
      />
		</v-col>
		<v-col v-show="rover.id" cols="3">
			<v-text-field
        v-model="commands"
        label="Commands"
        hint="L- left / R - right / M - move forward">
      </v-text-field>
		</v-col>
		<v-col v-if="rover.id" class="mt-3" :class="{'pl-12 text-right': this.$vuetify.breakpoint.mdAndUp}" cols="3">
			<v-btn :disabled="!commands" @click="sendCommands" color="success">Send</v-btn>
		</v-col>
		<v-col v-show="rover.id" cols="12">
			<span>Current position: {{currentPosition.x / 50}} - {{currentPosition.y / 50}} - {{currentPosition.direction}}</span>
		</v-col>
		<v-col cols="12">
			<div v-show="company.name" class="Plateau" :class="{'bottom15px': this.$vuetify.breakpoint.mdAndUp}">
				<v-icon color="black" class="RoverTop">mdi-arrow-up-thin-circle-outline</v-icon>
				<v-icon color="black" class="RoverBottom">mdi-arrow-down-thin-circle-outline</v-icon>
				<v-icon color="black" class="RoverRight">mdi-arrow-right-thin-circle-outline</v-icon>
				<v-icon color="black" class="RoverLeft">mdi-arrow-left-thin-circle-outline</v-icon>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import companyAPI from '@/api/company';
	import roverAPI from '@/api/rover';

	export default {
		data() {
			return {
				loading: false,
				companies: [],
				company: {},
				search: '',
				plateauSizes: {
					XXS: { x: 175, y: 125 },
					XS: { x: 275, y: 175 },
					S: { x: 375, y: 225 },
					M: { x: 475, y: 275 },
					L: { x: 575, y: 325 },
					XL: { x: 675, y: 375 },
					XXL: { x: 775, y: 425 },
				},
				plateau: null,
				rovers: [],
				rover: {},
				commands: '',
				currentPosition: {
					x: '0',
					y: '0',
					direction: 'N',
				},
				validCommand: true,
			};
		},

		mounted() {
			this.roverTop = document.querySelector('.RoverTop');
    	this.roverBottom = document.querySelector('.RoverBottom');
    	this.roverRight = document.querySelector('.RoverRight');
    	this.roverLeft = document.querySelector('.RoverLeft');
		},

		created() {
      this.fetchCompanies();
    },

    watch: {
    	company(company) {
    		this.fetchRovers(company.id);
    		this.plateau = document.querySelector('.Plateau');
    		this.plateau.style.height = `${this.plateauSizes[company.plateau_size].y}px`;
				this.plateau.style.width = `${this.plateauSizes[company.plateau_size].x}px`;
    	},
	    rover(rover) {
	    	const { coordinate_x, coordinate_y, direction } = rover;
	    	this.resetRover();
	    	if (coordinate_x === 0 && coordinate_y === 0) {
      		this.roverTop.style.left = '0';
      		this.roverTop.style.bottom = '0';
      		this.roverTop.style.display = 'block';
      		this.currentPosition = {
      			x: coordinate_x,
      			y: coordinate_y,
      			direction,
      		};
      	} else {
      		this.currentPosition = {
      			x: coordinate_x,
      			y: coordinate_y,
      			direction,
      		};
      		this.setDirection(direction);
      	}
	    },
    },

		methods: {
			setDisplayNone(direction) {
				direction.style.display = 'none';
			},
			setDisplayBlock(direction) {
				direction.style.display = 'block';
			},
			resetRover() {
				this.setTopPosition();
				this.setBottomPosition();
				this.setLeftPosition();
				this.setRightPosition();
				this.setDisplayNone(this.roverTop);
				this.setDisplayNone(this.roverBottom);
				this.setDisplayNone(this.roverLeft);
				this.setDisplayNone(this.roverRight);
			},
			setTopPosition() {
				this.roverTop.style.left = `${this.currentPosition.x}px`;
    		this.roverTop.style.bottom = `${this.currentPosition.y}px`;
			},
			setBottomPosition() {
				this.roverBottom.style.left = `${this.currentPosition.x}px`;
    		this.roverBottom.style.bottom = `${this.currentPosition.y}px`;
			},
			setLeftPosition() {
				this.roverLeft.style.left = `${this.currentPosition.x}px`;
    		this.roverLeft.style.bottom = `${this.currentPosition.y}px`;
			},
			setRightPosition() {
				this.roverRight.style.left = `${this.currentPosition.x}px`;
    		this.roverRight.style.bottom = `${this.currentPosition.y}px`;
			},
			setDirection(direction) {
				switch (direction) {
					case 'N':
						this.setDisplayBlock(this.roverTop);
						this.setTopPosition();
						break;
					case 'E':
						this.setDisplayBlock(this.roverRight);
						this.setRightPosition();
						break;
					case 'S':
						this.setDisplayBlock(this.roverBottom);
						this.setBottomPosition();
						break;
					case 'W':
						this.setDisplayBlock(this.roverLeft);
						this.setLeftPosition();
						break;
					default:
						break;
				}
			},
			turnLeft() {
				if (this.roverTop.style.display === 'block') {
					this.changeDirection(this.roverTop, this.roverLeft);
					this.setLeftPosition();
					this.currentPosition.direction = 'W';
					this.updateRovers();
				} else if (this.roverRight.style.display === 'block') {
					this.changeDirection(this.roverRight, this.roverTop);
					this.setTopPosition();
					this.currentPosition.direction = 'N';
					this.updateRovers();
				} else if (this.roverBottom.style.display === 'block') {
					this.changeDirection(this.roverBottom, this.roverRight);
					this.setRightPosition();
					this.currentPosition.direction = 'E';
					this.updateRovers();
				} else if (this.roverLeft.style.display === 'block') {
					this.changeDirection(this.roverLeft, this.roverBottom);
					this.setBottomPosition();
					this.currentPosition.direction = 'S';
					this.updateRovers();
				}
			},
			turnRight() {
				if (this.roverTop.style.display === 'block') {
					this.changeDirection(this.roverTop, this.roverRight);
					this.setRightPosition();
					this.currentPosition.direction = 'E';
					this.updateRovers();
				} else if (this.roverRight.style.display === 'block') {
					this.changeDirection(this.roverRight, this.roverBottom);
					this.setBottomPosition();
					this.currentPosition.direction = 'S';
					this.updateRovers();
				} else if (this.roverBottom.style.display === 'block') {
					this.changeDirection(this.roverBottom, this.roverLeft);
					this.setLeftPosition();
					this.currentPosition.direction = 'W';
					this.updateRovers();
				} else if (this.roverLeft.style.display === 'block') {
					this.changeDirection(this.roverLeft, this.roverTop);
					this.setTopPosition();
					this.currentPosition.direction = 'N';
					this.updateRovers();
				}
			},
			moveForward() {
				const plateauSize = this.plateauSizes[this.company.plateau_size];
				const coordinateY = this.currentPosition.y;
				const coordinateX = this.currentPosition.x;

				if (this.roverTop.style.display === 'block') {
					if (coordinateY + 50 > plateauSize.y) {
						this.validCommand = false;
						return false;
					}
					this.currentPosition.y = parseInt(coordinateY) + 50;
					this.setTopPosition();
					this.updateRovers();
				} else if (this.roverRight.style.display === 'block') {
					if (coordinateX + 50 > plateauSize.x) {
						this.validCommand = false;
						return false;
					}
					this.currentPosition.x = parseInt(coordinateX) + 50;
					this.setRightPosition();
					this.updateRovers();
				} else if (this.roverBottom.style.display === 'block') {
					if (coordinateY - 50 < 0) {
						this.validCommand = false;
						return false;
					}
					this.currentPosition.y = parseInt(coordinateY) - 50;
					this.setBottomPosition();
					this.updateRovers();
				} else if (this.roverLeft.style.display === 'block') {
					if (coordinateX - 50 < 0) {
						this.validCommand = false;
						return false;
					}
					this.currentPosition.x = parseInt(coordinateX) - 50;
					this.setLeftPosition();
					this.updateRovers();
				}
				return false;
			},
			changeDirection(to, from) {
				to.style.display = 'none';
				from.style.display = 'block';
			},
			sendCommands() {
				this.validCommand = true;
				if (this.commands) {
					for (const command of this.commands) {
						switch (command) {
							case 'L':
								this.turnLeft();
								break;
							case 'R':
								this.turnRight();
							  break;
							case 'M':
								if (this.validCommand) {
									this.moveForward();
								}
							  break;
							default:
								this.$store.commit('SET_MESSAGE', `Invalid command: ${command}`);
								break;
						}
					}
					this.updateRovers();
				}
			},
			async fetchCompanies() {
        this.loading = true;
        try {
          const { data: company } = await companyAPI.fetch({ search: this.search });
          if (company.length === 0) this.$store.commit('SET_MESSAGE', 'None companies found');
          this.companies = company;
        } catch (error) {
          this.$store.commit('SET_MESSAGE', 'None companies found');
        } finally {
          this.loading = false;
        }
      },
      async fetchRovers(id) {
        this.loading = true;
        try {
          const { data: rover } = await roverAPI.fetch({ company_id: id });
          if (rover.length === 0) this.$store.commit('SET_MESSAGE', 'None rovers found');
          this.rovers = rover;
        } catch (error) {
        	this.$store.commit('SET_MESSAGE', 'None rovers found');
        } finally {
          this.loading = false;
        }
      },
      async updateRovers() {
        this.loading = true;
        const { x, y, direction } = this.currentPosition;
        const update = {
        	coordinate_x: x,
        	coordinate_y: y,
        	direction,
        };
        try {
          await roverAPI.update(this.rover.id, update);
        } catch (error) {
          this.$store.commit('SET_MESSAGE', 'Wrong coordinates sent');
        } finally {
          this.loading = false;
        }
      },
		},
	};
</script>

<style scoped>
	.Plateau {
		height: 275px;
		width: 475px;
		border: 1px solid #ccc;
		position: absolute;
		left: 15px;
	}
	.bottom15px {
		bottom: 15px;
	}
	.ButtonsPlateauSize {
		border: 1px solid #ccc;
		z-index: 2;
	}
	.RoverTop, .RoverRight, .RoverLeft, .RoverBottom {
		display: none;
		position: absolute;
	}
</style>
