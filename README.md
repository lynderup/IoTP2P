# IoTP2P

## Server structure

Milestone 1 (præsenteres uge 8)
I skal implementere den basale Chord-ring. Det skal være muligt at joine ringen, og det skal være muligt pænt at forlade ringen. I skal implementere find_successor funktionen, således at man kan finde den ansvarlige peer for et givent id.
Krav: Kommunikationen mellem peers skal være RESTful. Den enkelte peer skal overfor en webbrowser præsentere en simpel side, hvor man kan foretage en søgning efter id (resultatet et link til den ansvarlige peer), samt inspicere peerens basale tilstand (såsom ID, successor og predecessor (de to sidste som links)).
I må gerne antage som udgangspunkt, at én Chord-peer altid er kendt og forventes at virke.

Bonus: Gør jeres ring robust over churn v.hj.a. successorlister.

* find_successor
* join?

### Gets
http://www.nodebeginner.org/#javascript-and-nodejs
http://localhost:8888/{method}/{params, fx id}
Routing, opdeling i filer?
SQLlite

* find_predecessor
* closest_preceding_finger

## Client structure
* soeg efter ID
* inspicer peers tilstand

jQuery

# Gruppestruktur
Onsdag 9-14

Kasper Jensen lynderupjensen@gmail.com
Timothi Hansen timsen88@gmail.com
Rohde Fischer rohdef@rohdef.dk Turing-128
