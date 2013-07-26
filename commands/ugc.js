var ugc = 'http://ugcleague.com/team_page_matches.cfm?clan_id=7594'

module.exports = function(irc) {
  irc.client.say(irc.to, ugc)
}