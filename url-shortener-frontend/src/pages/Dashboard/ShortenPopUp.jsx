import Modal from '@mui/material/Modal';
import CreateNewShorten from './CreateNewShorten';

const ShortenPopUp = ({ open, setOpen, refetch}) => {

    const handleClose = () => {
        setOpen(false);
    };

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        /* Added custom styling here for the premium frosted-glass backdrop */
        sx={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Lightens the default harsh MUI backdrop
        }}
      >
        {/* Added p-4 to ensure safe padding on mobile devices, and focus:outline-none to remove the blue click ring */}
        <div className='flex justify-center items-center h-full w-full p-4 focus:outline-none'>
            <CreateNewShorten setOpen={setOpen} refetch={refetch} />
        </div>
      </Modal>
  )
}

export default ShortenPopUp;