const moment = require('moment')

module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date 
         : moment().endOf('day').toDate()

         app.db('tasks')
          .where({ user_id: req.user.id })
          .where('estimate_at', '<=', date)
          .orderBy('estimate_at')
          .then(tasks => res.json(tasks))
          .catch(err => res.status(400).json(err))
        
         
    }   
    

    const save = (req, res) => {
        if(!req.body.desc.trim()){
            return res.status(400).send('Descrição é uma campo obrigatorio!')
        }

        req.body.user_id = req.user.id

        app.db('tasks')
        .insert(req.body)
        .then(_ => res.status(204).send())
        .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
        .where({ id: req.params.id, user_id: req.user.id})
        .del()
        .then(rowsDeleted => {
            if(rowsDeleted > 0) {
                res.status(204).send()
            }else{
                const msg = `Não foi encontrado task com id ${req.params.id}.`
                res.status(400).send(msg)
            }
        })
        .catch(err => res.status(400).json(err))
    }

    const updateTaksDoneAt = (req, res, doneAt) => {
        app.db('tasks')
        .where({ id: req.params.id, user_id: req.user.id})
        .update({ doneAt })
        .then(_ => res.status(204).send())
        .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
        .where({ id: req.params.id, user_id: req.user.id})
        .first()
        .then(task => {
            if(!task){
                const msg = `Taks com id ${req.params.id}`
                return res.status(400).json(msg)
            }

            const doneAt = task.doneAt ? null : new Date()
            updateTaksDoneAt(req, res, doneAt)
        })

        .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask}
}