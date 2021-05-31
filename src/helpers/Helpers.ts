import { iSlot, iSlotType } from "../classes/Slot";


export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }


export async function createKey(slot: iSlot, counter: number) {
        return slot.orderId?.toString() || '';
     //   return counter?.toString() + slot?.y?.toString() + slot?.x?.toString();
}

export async function addSlotBatch (context: any, pattern: any, startPositions: any, slots: any, slotType: iSlotType, players: Array<any>, directMap: boolean, orientation: string, _counter: any) {

  let x = 0;
  let y = 0;
  const counter = _counter;
  let occupied = undefined;
  let player = undefined;

  // calculate path of slots from 1 or more starting places
  for (var i = 0; i < startPositions.length; i++) {

      // initialize x and y for pattern start
      x = (startPositions[i].x * context.multiplier);
      y = (startPositions[i].y * context.multiplier);

      // if there's a player, set player
      if (slotType === iSlotType.End || slotType === iSlotType.Start) {
          player = players[i];
      }
      let slot: iSlot = {x: x, y: y, occupied: occupied, slotType: slotType, orderId: counter.count, owner: player, key: undefined}
      await context.addSlot(slot, slots, counter);   
      


      // calculates tht direction to move and place the next slot
      // if its directly mapped the pattern is 1:1 with the startposition array
      var j = directMap ? i : 0;
      var bound = directMap ? (j + 1) : pattern.length;
      for (j; j < bound; j++) {

          // Diagonal scales differently
          if (orientation === "Diagonal") {
              let duration = pattern[j]["duration"] || 1;

              for (let k = 0; k < duration; k++) {
                  let model = {x: x, y: y};
                  model["x"] += (pattern[j]["x"] * context.multiplier);
                  model["y"] += (pattern[j]["y"] * context.multiplier);
                  let slot: iSlot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, 
                    orderId: counter.count, owner: player, key: undefined}
                  await context.addSlot(slot, slots, counter);
                  x = model.x;
                  y = model.y;
              }
          } else {
              for (let k = 0; k < pattern[j][2]; k++) {

                  let model: any = {x: x, y: y};
                  
                  model[pattern[j][0]] += (pattern[j][1] * context.multiplier);
  
                  let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, orderId: counter.count, owner: player}

                  await context.addSlot(slot, slots, counter);
  
                  x = model.x;
                  y = model.y;
              }
          }
      }
  }
  return slots;
}