import Docker from "dockerode";

const docker = new Docker({
    host: "localhost",
    port: 2375,
});

export default docker;