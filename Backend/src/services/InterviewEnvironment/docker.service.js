import Docker from "dockerode";

const docker = new Docker({
  host: "localhost",
  port: 2375,
});


const ensureImage = async (image) => {
  try {
    await docker.getImage(image).inspect();

  } catch (err) {

    console.log(`Pulling Docker image ${image}...`);

    await new Promise((resolve, reject) => {

      docker.pull(image, (pullErr, stream) => {

        if (pullErr) {
          return reject(pullErr);
        }

        docker.modem.followProgress(stream, (followErr) => {

          if (followErr) {
            return reject(followErr);
          }

          resolve();

        });

      });

    });
  }
};



export const createContainer = async ({
  image,
  workspacePath,
  name,
  environment
}) => {

  await ensureImage(image);


  const isDevelopmentServer =
    environment.language === "REACT";


  const binds = [
    `${workspacePath}:/workspace`
  ];


  // Only React needs persistent node_modules
  if (isDevelopmentServer) {

    binds.push(
      "node_modules_cache:/workspace/node_modules"
    );

  }



  const containerConfig = {

    name,

    Image: image,

    WorkingDir: "/workspace",


    // Container lifecycle command
    Cmd: environment.containerStartCommand,


    Entrypoint: [],



    HostConfig: {

      Binds: binds,


      AutoRemove: false

    }

  };



  // Add port configuration only if environment supports preview

  if(environment.supportsPreview && environment.previewPort){

    containerConfig.ExposedPorts = {

      [`${environment.previewPort}/tcp`]: {}

    };


    containerConfig.HostConfig.PortBindings = {

      [`${environment.previewPort}/tcp`]: [
        {
          HostPort: ""
        }
      ]

    };

  }


  console.log(containerConfig)
  const container = await docker.createContainer(
    containerConfig
  );


  await container.start();


  return container;

};