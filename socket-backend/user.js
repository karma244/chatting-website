const users = []

const addUser = ({ id, name }) => {
//이름의 공백 제거
  name = name.trim().toLowerCase()

  const user = { id, name }

  users.push(user)

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) return users.splice(index, 1)[0]
}

const getUserName = (id) => {
  var found = users.find(e => e.id === id);
  return found.name;
}

module.exports = { addUser, removeUser, getUserName }