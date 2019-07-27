
class Wheels {
  constructor(obj, pgp) {
    this.obj = obj;
    this.pgp = pgp;
  }

  async all() {
    const wheelList = await this.obj.any(
      'SELECT wheel_id, title, is_visible, priority'
      + ' FROM wheels'
      + ' ORDER BY priority ASC'
    );

    return await Promise.all(
      wheelList.map(
        async (wheel) => await findWheel(this.obj, wheel)
      )
    );
  }

  async find(id) {
    const wheel = await this.obj.one(
      'SELECT wheel_id, title, is_visible, priority FROM wheels'
      + ' WHERE wheel_id = $1'
      + ' ORDER BY priority ASC',
      [id]
    );

    return await findWheel(this.obj, wheel);
  }


  async insert({ title, turnList, isVisible, ownerId, priority }) {
    return await this.obj.tx(async (t) => {
      const wheel = await t.one(
        'INSERT INTO wheels'
        + ' (owner_id, title, is_visible, priority)'
        + ' VALUES ($1, $2, $3, $4)'
        + ' RETURNING *',
        [ownerId, title, isVisible, priority]
      );

      if (turnList.length <= 0) {
        return await findWheel(this.obj, wheel);
      }

      const queryList = turnList.map((turn, index) => {
        return {
          user_id: turn.userId,
          wheel_id: wheel.wheel_id,
          priority: index
        };
      });

      await t.none(this.pgp.helpers.insert(queryList, ['user_id', 'wheel_id', 'priority'], 'turns'));

      return await findWheel(this.obj, wheel);
    });
  }

  async delete(id) {
    await this.obj.any('DELETE FROM turns WHERE wheel_id = $1', [id]);
    await this.obj.any('DELETE FROM wheels WHERE wheel_id = $1', [id]);
  }

  async update({ id, title, turnList, isVisible, priority }) {
    return await this.obj.tx(async (t) => {
      const wheel = await t.one(
        'UPDATE wheels'
        + ' SET title = $1, is_visible = $2, priority = $3'
        + ' WHERE wheel_id = $4 RETURNING *',
        [title, isVisible, priority, id]
      );

      await t.any('DELETE FROM turns WHERE wheel_id = $1', [id]);

      if (turnList.length <= 0) {
        return await findWheel(this.obj, wheel);
      }

      const queryList = turnList.map((turn, index) => {
        return {
          user_id: turn.userId,
          wheel_id: wheel.wheel_id,
          priority: index
        };
      });

      await t.none(this.pgp.helpers.insert(queryList, ['user_id', 'wheel_id', 'priority'], 'turns'));

      return await findWheel(this.obj, wheel);
    });
  }
}

const findWheel = async (obj, wheel) => {
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

module.exports = Wheels;
