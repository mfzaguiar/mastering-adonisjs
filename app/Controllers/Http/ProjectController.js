'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index({ request }) {
    const { page } = request.get()

    const projects = await Project.query()
      .with('user')
      .paginate(page)

    return projects
  }

  async store({ request, auth }) {
    const data = request.only(['title', 'description'])

    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  async show({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('tasks')

    return project
  }

  async update({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      const data = request.only(['title', 'description'])

      project.merge(data)

      project.save()

      return project
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Falha ao alterar' } })
    }
  }

  async destroy({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}

module.exports = ProjectController
