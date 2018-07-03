const currentGame = "http://rocket.pelidev.com/api/game/current";

export const getCurrentGame = () => fetch(currentGame).then(res => res.json());
