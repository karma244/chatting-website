const users = []

const addUser = ({ id, name }) => {
//이름의 공백 제거
  name = name.trim().toLowerCase()

  const existingUser = users.find(
    (user) => user.name === name
  )

  if (!name ) return { error: '사용자 이름이 필요합니다.' }
  if (existingUser) return { error: '이미 사용중인 이름입니다.' }

  const user = { id, name }

  users.push(user)

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => users.find((user) => user.id === id)

module.exports = { addUser, removeUser, getUser }