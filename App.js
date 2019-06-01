/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Image,
    Modal,
    TouchableOpacity,
    CameraRoll
} from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            refreshing: false,
            data: [],
            page: 1,
            ModalVisibleStatus: false,
            SelectImage: '',
        }
    }


    componentDidMount(): void {
        this.getData()
    }


    async getData() {
        // this.loader()
        const url = `https://webapi.500px.com/discovery/fresh?rpp=20&feature=fresh&image_size%5B%5D=31&page=${this.state.page}`
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data: [...this.state.data, ...responseJson.photos],
                    loading: false,
                    refreshing: false
                })
            })
            .catch((error) => {
                console.error(error);
            })


    }

    //newPage = () => {
        // this.setState({
        //     page: this.state.page + 1
        // },
        //    await this.getData()
        // )
    //}

    // refresh() {
    //     this.setState({
    //         page: 1,
    //         refreshing: true,
    //     }, () => {
    //         this.getData()
    //     })
    // }

    // loader = () => {
    //     if (!this.state.loading) {
    //         return null;
    //     }
    //     return (
    //         <View style={styles.loader}>
    //             <ActivityIndicator animating size="large"/>
    //         </View>
    //     )
    // }

    // separator = () => {
    //
    // }

    ShowModal(visible, imageURL) {
        this.setState({
            ModalVisibleStatus: visible,
            SelectImage: imageURL,
        })
    }


    render() {
        return (
            <View style={styles.container}>
                <FlatList data={this.state.data}
                          renderItem={({item}) =>
                              <TouchableOpacity onPress={this.ShowModal.bind(this, true, item.images[0].url)}
                                                style={{flex: 1, flexDirection: 'column',}}>
                                  <Image style={styles.image} source={{uri: item.images[0].url}}/>
                              </TouchableOpacity>
                          }
                          numColumns={2}
                          keyExtractor={(item, index) => index}
                          // onEndReached={this.newPage()}
                          // onEndReachedThreshold={0}


                />
                {
                    this.state.ModalVisibleStatus ? (
                        <Modal transparent={false} visible={this.state.ModalVisibleStatus} animationType={"fade"}
                               onRequestClose={() => {
                                   this.ShowModal(!this.state.ModalVisibleStatus)
                               }}>
                            <View style={styles.modal}>
                                <Image style={styles.modalImage} source={{uri: this.state.SelectImage}}/>
                                <TouchableOpacity actveOpacity={0.5} style={styles.closeButton} onPress={() => {
                                    this.ShowModal(!this.state.ModalVisibleStatus)
                                }}>
                                    <Image style={{width: 25, height: 25}}
                                           source={{uri: 'https://reactnativecode.com/wp-content/uploads/2018/01/close_button.png'}}/>
                                </TouchableOpacity>
                            </View>

                        </Modal>
                    ) : null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    item: {},
    image: {
        height: 200,
    },
    loader: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#d0004a"
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    modalImage: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '98%',
        resizeMode: 'contain'
    },
    closeButton: {
        top: 9,
        left: 9,
        width: 25,
        height: 25,
        position: 'absolute'
    }
});