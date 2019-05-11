const pgp = require('pg-promise')({
  extend(obj, dc) {
    const findWheel = async (wheel) => {
      const turnList = await obj.any(
        'SELECT t.turn_id, u.user_id, u.name FROM turns t'
        + ' INNER JOIN users u ON u.user_id = t.user_id'
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
          id: turn.turn_id,
          userId: turn.user_id,
          name: turn.name,
        }))
      };
    };

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

          const queryList = turnList.map((turn, index) => {
            const dataList = {
              user_id: turn.userId,
              wheel_id: wheel.wheel_id,
              priority: index
            };

            t.none('INSERT INTO turns ($1:name) VALUES($1:csv)', dataList);
          });

          await t.batch(queryList);

          return await findWheel(wheel);
        });
      },
      async delete(id) {
        await obj.any('DELETE FROM wheels WHERE wheel_id = $1', [id]);
        await obj.any('DELETE FROM turns WHERE wheel_id = $1', [id]);
      },
      async update({ id, title, turnList, isVisible, priority }) {
        return await obj.tx(async (t) => {
          const wheel = t.any(
            'UPDATE wheels'
            + ' SET title = $1, is_visible = $2, priority = $3'
            + ' WHERE wheel_id = $4 RETURNING *',
            [title, isVisible, priority, id]
          );

          await t.any('DELETE FROM turns WHERE wheel_id = $1', [id]);

          const queryList = turnList.map((turn, index) => {
            const dataList = {
              user_id: turn.userId,
              wheel_id: wheel.wheel_id,
              priority: index
            };

            t.none('INSERT INTO turns ($1:name) VALUES($1:csv)', dataList);
          });

          await t.batch(queryList);

          return await findWheel(wheel);
        });
      }
    }
  }
});

const client = pgp({
  user: 'chuhta',
  password: 'admin',
  database: 'chores',
  host: 'localhost',
  port: 5432,
  max: 20,
  statement_timeout: 10000,
});

module.exports = client;
