// account address
var accountAddress
// var account = web3.toChecksumAddress(web3.eth.accounts[0])

// account balance
var balance

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            web3.eth.sendTransaction({/*...*/});
        } catch (error) {
            // web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/d81a3501521247ce9a510f4e8317219b"));
        }
    }
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        web3.eth.sendTransaction({/*...*/}); 
    }
    else {
        // web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/d81a3501521247ce9a510f4e8317219b"));
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // get address from MetaMask
    web3.eth.getAccounts(function(error, result) {
        if(error) {
            console.log(error)
        } else {
            accountAddress = result
            $('#address').text(accountAddress)
            console.log('Account address: ' + accountAddress)

            let acc = accountAddress + ''
            acc = acc.substring(2, acc.length)

            // get account balance in Ether
            web3.eth.getBalance(acc, function(error, res) {
                if(error) {
                    console.log(error)
                } else {
                    balance = res
                    $('#ETHbalance').text( web3.fromWei(balance, 'ether').toFixed(4) + ' Ξ')
                }
            })
        }
    })
})

function register() {
    if(document.getElementById('fileHash')) {
        var hash = document.getElementById('fileHash').innerHTML

        let txObject = {
            from: accountAddress + '',
            to: accountAddress + '',
            value: web3.toWei(0, 'ether'),
            data: hash,
            gas: 30000
        }
        // console.log('Tx object', txObject)

        web3.eth.sendTransaction(txObject, function (error, txHash) {
            if(error) {
                console.log('There was an error sending transaction')
            } else {
                alert('Your transaction has been broadcasted\nTransaction hash:\n' + txHash)
                let kovanEtherscanlink = 'https://kovan.etherscan.io/tx/' + txHash;
                document.getElementById('txLink').innerHTML =
                    '<a href=\'' + kovanEtherscanlink + '\' target=\"_blank\">See transaction on Etherscan</a><br />';
            }
        })
    } else {
        alert('Please select and hash a file first')
    }
}