
class Users {
  constructor(obj) {
    this.obj = obj;
  }

  async all() {
    const userList = await this.obj.any(
      'SELECT user_id, name'
      + ' FROM users'
    );

    return userList.map(formatUser);
  }
}

/**
 * Converts the DB user into a view user.
 *
 * Can this have async removed?
 *
 * @param {Object} user An object of "user_id" and "name".
 *
 * @return {Object} An object of "id" and "name".
 */
const formatUser = (user) => {
  return {
    id: user['user_id'],
    name: user['name'],
  };
};

module.exports = Users;
