import CreateDocumentModel from '@/components/CreateDocumentModel';
import InviteUserModal from '@/components/InviteUserModal';

const ModelProvider = (): JSX.Element => {
  return (
    <>
      <CreateDocumentModel />
      <InviteUserModal />
    </>
  );
};

export default ModelProvider;
