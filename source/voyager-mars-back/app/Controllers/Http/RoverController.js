'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpStatus = use('http-status-codes');

const Rover = use('App/Models/Rover');

const RoverNotFoundException = use('App/Exceptions/RoverNotFoundException');
const RoverAlreadyExistException = use('App/Exceptions/RoverAlreadyExistException');

/**
 * Resourceful controller for interacting with rovers
 */
class RoverController {
  /**
   * Show a list of all rovers.
   * GET rovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const {
      sortBy = 'name',
      descending = 'asc',
      search = '',
      company_id = '',
    } = request.all();

    const rovers = Rover.query()
    .with('company', (company) => {
      company.select('id', 'name');
    })
    .orderBy(sortBy, descending);

    if(company_id) {
      rovers.where(function() {
        this.where('company_id', 'like', `%${company_id}%`);
      });
    }
    else if(search) {
      rovers.where(function() {
        this.where('code', 'like', `%${search}%`)
        .orWhere('name', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
        .orWhere('location', 'like', `%${search}%`);
      });
    }

    return rovers.fetch();
  }

  /**
   * Render a form to be used for creating a new rover.
   * GET rovers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use POST on /rovers to create a new rover');
  }

  /**
   * Create/save a new rover.
   * POST rovers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const {
      code,
      name,
      description,
      location,
      coordinate_x,
      coordinate_y,
      direction,
      company_id,
    } = request.all();

    const roverExist = await Rover.query().where({ code }).getCount() > 0;

    if(roverExist) {
      throw new RoverAlreadyExistException(code);
    }

    return Rover.create({
      code,
      name,
      description,
      location,
      coordinate_x,
      coordinate_y,
      direction,
      company_id,
    });
  }

  /**
   * Display a single rover.
   * GET rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    return Rover.query().where({id: params.id}).first();
  }

  /**
   * Render a form to update an existing rover.
   * GET rovers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    response.status(HttpStatus.METHOD_NOT_ALLOWED).send('Method not available for Rover. Use PUT on /rovers to update a Rover');
  }

  /**
   * Update rover details.
   * PUT or PATCH rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {
      code,
      name,
      description,
      location,
      coordinate_x,
      coordinate_y,
      direction,
      company_id,
    } = request.all();

    const rover = await Rover.query().where({id: params.id}).first();

    if(!rover) {
      throw new RoverNotFoundException(params.id);
    }

    rover.merge({
      code,
      name,
      description,
      location,
      coordinate_x,
      coordinate_y,
      direction,
      company_id,
    });

    return rover.save();
  }

  /**
   * Delete a rover with id.
   * DELETE rovers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const rover = await Rover.query().where({id: params.id}).first();

    if(!rover) {
      throw new RoverNotFoundException(params.id);
    }

    return rover.delete();
  }
}

module.exports = RoverController;
