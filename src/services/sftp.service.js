import SupervisorService from "@/services/supervisor.service";

const SftpService = {
  exportOrderToSftp(payload = {}) {
    return SupervisorService.post(`/api/v1/sftp/export_order`, payload);
  }
};
export default SftpService;
