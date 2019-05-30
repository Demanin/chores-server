const pgp = require('pg-promise')({
  extend(obj, dc) {
    const findWheel = async (wheel) => {
      const turnList = await obj.any(
        'SELECT t.turn_id, t.user_id FROM turns t'
        + ' WHERE t.wheel_id = $1'
        + ' ORDER BY t.priority ASC',
        [wheel.wheel_id]
      );

      return {
        id: wheel.wheel_id,
        title: wheel.title,
        isVisible: wheel.is_visible,
        priority: wheel.priority,
        turnList: turnList.map((turn) => ({
          priority: turn.priority,
          userId: turn.user_id,
        }))
      };
    };

    obj.users = {
      async all() {
        const userList = await obj.any(
          'SELECT user_id, name'
          + ' FROM users'
        );

        const formattedList = await Promise.all(userList.map(async (user) => {
          return {
            id: user['user_id'],
            name: user['name'],
          };
        }));

        return formattedList;
      }
    }
    obj.wheels = {
      async all() {
        const wheelList = await obj.any(
          'SELECT wheel_id, title, is_visible, priority'
          + ' FROM wheels'
          + ' ORDER BY priority ASC'
        );

        const formattedList = await Promise.all(wheelList.map(async (wheel) => {
          return await findWheel(wheel);
        }));

        return formattedList;
      },
      async find(id) {
        const wheel = await obj.one(
          'SELECT wheel_id, title, is_visible, priority FROM wheels'
          + ' WHERE wheel_id = $1'
          + ' ORDER BY priority ASC',
          [id]
        );

        return await findWheel(wheel);
      },
      async insert({ title, turnList, isVisible, ownerId, priority }) {
        return await obj.tx(async (t) => {
          const wheel = await t.one(
            'INSERT INTO wheels'
            + ' (owner_id, title, is_visible, priority)'
            + ' VALUES ($1, $2, $3, $4)'
            + ' RETURNING *',
            [ownerId, title, isVisible, priority]
          );

          if (turnList.length <= 0) {
            return await findWheel(wheel);
          }

          const queryList = turnList.map((turn, index) => {
            return {
              user_id: turn.userId,
              wheel_id: wheel.wheel_id,
              priority: index
            };
          });

          await t.none(pgp.helpers.insert(queryList, ['user_id', 'wheel_id', 'priority'], 'turns'));

          return await findWheel(wheel);
        });
      },
      async delete(id) {
        await obj.any('DELETE FROM turns WHERE wheel_id = $1', [id]);
        await obj.any('DELETE FROM wheels WHERE wheel_id = $1', [id]);
      },
      async update({ id, title, turnList, isVisible, priority }) {
        return await obj.tx(async (t) => {
          const wheel = await t.one(
            'UPDATE wheels'
            + ' SET title = $1, is_visible = $2, priority = $3'
            + ' WHERE wheel_id = $4 RETURNING *',
            [title, isVisible, priority, id]
          );

          await t.any('DELETE FROM turns WHERE wheel_id = $1', [id]);

          if (turnList.length <= 0) {
            return await findWheel(wheel);
          }

          const queryList = turnList.map((turn, index) => {
            return {
              user_id: turn.userId,
              wheel_id: wheel.wheel_id,
              priority: index
            };
          });

          await t.none(pgp.helpers.insert(queryList, ['user_id', 'wheel_id', 'priority'], 'turns'));

          return await findWheel(wheel);
        });
      }
    }
  }
});

const client = pgp({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: 20,
  statement_timeout: 10000,
});

module.exports = client;
