/*
  CHANGE LOG
  2014-10-08: First commit. Will decide between killing nearby weak enemies or capturing nearby mines
      * Started adjacent to apponent, just stood there on got beat on until he died
  2014-10-09: Second commit. Avoid strong opponents, pick off targets of opportunity, control mines
 */


// Unnamed
var move = function( gameData, helpers ) {
    var HERO = gameData.activeHero,
        INJURY_THRESHOLD = 40,
        nearestEnemy = helpers.findNearestEnemy( gameData, true ),
        nearestWeakerEnemy = helpers.findNearestWeakerEnemy( gameData, true ),
        nearestTeamMember = helpers.findNearestTeamMember( gameData, true ),
        nearestNonTeamDiamondMine = helpers.findNearestNonTeamDiamondMine( gameData, true ),
        nearestUnownedDiamondMine = helpers.findNearestUnownedDiamondMine( gameData, true );

    // Be a coward and run away from nearby stronger enemies.
    if( nearestEnemy.distance < 2 && nearestEnemy.coords !== nearestWeakerEnemy.coords ) {
        return helpers.moveAwayFrom( nearestEnemy.direction );
    }

    // Seek healing if seriously injured.
    if( HERO.health < INJURY_THRESHOLD ) {
        return helpers.findNearestHealWell( gameData );
    }

    // Now that basic survival is seen to, let's see about winning.

    // First, pick off targets of opportunity.
    if( nearestWeakerEnemy.distance < 2 ) {
        return nearestWeakerEnemy.direction;
    }

    // Then give a boost to adjacent teammates.
    if( nearestTeamMember.distance < 2 ) {
        return nearestTeamMember.direction;
    }

    // Then try to steal a diamond mine, unless an unclaimed mine is considerably closer.
    if( nearestNonTeamDiamondMine.distance === undefined ) {
        if( nearestUnownedDiamondMine.distance === undefined ) {
            // If we own all of the mines, make a choice: if we outnumber them, go kill someone; if not, stay alive.
            return ( helpers.assessment.myTeamHasMoreHeroes( gameData ) ) ? nearestEnemy.direction : helpers.moveAwayFrom( nearestEnemy.direction );
        } else {
            return nearestUnownedDiamondMine.direction;
        }
    }

    return ( nearestNonTeamDiamondMine.distance - nearestUnownedDiamondMine.distance > 2 ) ? nearestUnownedDiamondMine.direction : nearestNonTeamDiamondMine.direction;
}

// Tester
// Used to test helpers.assessment object
//var move = function( gameData, helpers ) {
//    var HERO = gameData.activeHero;

//    if( helpers.assessment.countEnemies( gameData ) > 0 ) {
//        return "East";
//    -} else {
//        return "South";
//    }
//}

// Export the move function here
module.exports = move;
