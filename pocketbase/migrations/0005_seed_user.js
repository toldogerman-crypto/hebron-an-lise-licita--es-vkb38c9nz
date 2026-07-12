migrate(
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'toldogerman@gmail.com')
      record.setPassword('ger123456@')
      record.setVerified(true)
      record.set('name', 'Admin Hebron')
      app.save(record)
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const record = new Record(users)
      record.setEmail('toldogerman@gmail.com')
      record.setPassword('ger123456@')
      record.setVerified(true)
      record.set('name', 'Admin Hebron')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'toldogerman@gmail.com')
      record.setPassword('Skip@Pass')
      app.save(record)
    } catch (_) {}
  },
)
