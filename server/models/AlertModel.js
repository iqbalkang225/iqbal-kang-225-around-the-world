const db = require('../utils/connectDB')

class Alert {
  constructor(alertFor, alertFrom, type, placeId, commentId, text) {
    this.alertFor = alertFor
    this.alertFrom = alertFrom
    this.text = text
    this.type = type
    this.commentId = commentId
    this.placeId = placeId
  }

  async save() {
    const dbQuery = `INSERT INTO alerts (alert_for, alert_from, type, place_id, comment_id, text )
                   VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`
    const values = [this.alertFor, this.alertFrom, this.type, this.placeId, this.commentId, this.text]

    const data = await db.query(dbQuery, values)
    return data.rows[0]
  }

  static async findById(alertId) {
    const dbQuery = `SELECT alerts.*, users.* FROM alerts
                     JOIN users ON alerts.alert_from = users.id
                     WHERE alerts.id = ${alertId};`

    const data = await db.query(dbQuery)
    return data.rows[0]
  }

  static async findByUserId(userId) {
    const dbQuery = `SELECT  users.*, alerts.* FROM alerts
                     JOIN users ON alerts.alert_from = users.id
                     WHERE alert_for = ${userId};`

    const data = await db.query(dbQuery)
    return data.rows
  }

  static async findByIdsAndDelete(followingId, followerId) {
    const dbQuery = `DELETE FROM alerts
                     WHERE alert_for = ${followingId} AND alert_from = ${followerId};`

    const data = await db.query(dbQuery)
    return data.rows[0]
  }

  static async deleteAlert(followingId, alertId) {
    const dbQuery = `DELETE FROM alerts
                     WHERE alert_for = ${followingId} AND alerts.id = ${alertId};`

    const data = await db.query(dbQuery)
    return data.rows[0]
  }

  static async deleteAll(userId) {
    const dbQuery = `DELETE FROM alerts
                     WHERE alert_for = ${userId}`

    const data = await db.query(dbQuery)
    return data.rows[0]
  }

  static async deleteLikeAlert(commentId, placeId, type) {
    const dbQuery = `DELETE FROM alerts
                     WHERE comment_id = ${commentId} AND place_id= ${placeId} and type='${type}';`

    const data = await db.query(dbQuery)
    return data.rows[0]
  }
}

module.exports = Alert
