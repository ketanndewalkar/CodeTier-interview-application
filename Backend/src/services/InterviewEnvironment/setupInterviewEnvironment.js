import { createWorkspace } from "./workspace.service.js";
import "dotenv/config";
import { createContainer } from "./docker.service.js";
import { Interview } from "../../models/interview.model.js";
import {
  Environment,
  InterviewEnvironment,
} from "../../models/environment.model.js";
const PORT = process.env.PORT || 8080;
export const setupInterviewEnvironment = async (interviewId) => {
  const interview = await Interview.findById(interviewId);
  const environment = await Environment.findById(interview.environmentId);

  const interviewEnvironment = await InterviewEnvironment.create({
    interviewId,
    environmentId: environment._id,
    status: "PROVISIONING",
  });
  const workspacePath = await createWorkspace({
    interviewId,
    repositoryUrl: environment.workspaceTemplate,
  });
  const container = await createContainer({
    image: environment.dockerImage,
    name: environment.language,
    workspacePath,
    environment,
  });
  const containerInfo = await container.inspect();

  const port =
    containerInfo.NetworkSettings.Ports[`${environment.previewPort}/tcp`][0]
      .HostPort;

  interviewEnvironment.containerId = container.id;
  interviewEnvironment.roomId = interviewId;
  interviewEnvironment.workspacePath = workspacePath;
  interviewEnvironment.info = {
    containerPort: environment.previewPort,
    hostPort: port,
    url: environment.supportsPreview ? `http://localhost:${port}` : "",
  };
  interviewEnvironment.status = "RUNNING";

  await interviewEnvironment.save();

  console.log("Container started", container);
};
