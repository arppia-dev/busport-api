// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const httpServer = strapi.server.httpServer;
    if (!httpServer) {
      strapi.log.error("Could not obtain the HTTP server for socket.io");
      return;
    }

    const { Server } = await import("socket.io");
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      strapi.log.info("Client connected to socket.io");

      socket.on("message", (data: any) => {
        strapi.log.info(`Coordinates received: ${JSON.stringify(data)}`);

        io.emit("message", data);
      });

      socket.on("disconnect", () => {
        strapi.log.info("Client disconnected from socket.io");
      });
    });

    strapi.io = io;
  },
};
