import Modal from '@mui/material/Modal';
import CreateNewShorten from './CreateNewShorten';

const ShortenPopUp = ({ open, setOpen, refetch}) => {
    const handleClose = () => setOpen(false);

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Darkened slightly for higher contrast on the premium modal
        }}
      >
        <div className='flex justify-center items-center h-full w-full p-4 focus:outline-none'>
            <CreateNewShorten setOpen={setOpen} refetch={refetch} />
        </div>
      </Modal>
  )
}

export default ShortenPopUp;