import '../../../styles/loading.css';

export default () => {
  return `
        <div class="loading-container">
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p>Loading...</p>
        </div>
    `;
};
