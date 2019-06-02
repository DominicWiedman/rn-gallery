/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Image,
    Modal,
    Button,
    TouchableOpacity,

} from 'react-native';

export default class App extends React.Component {

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


    getData = async () => {
        this.loader()
        let url = `https://webapi.500px.com/discovery/fresh?rpp=10&feature=fresh&image_size%5B%5D=3&image_size%5B%5D=36&page=${this.state.page}`
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data: [...this.state.data, ...responseJson.photos],
                    loading: false,
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    newPage = async () => {
        this.setState({
                page: this.state.page + 1
            }, () => {
                this.getData()
            }
        )
    }

    loader() {
        if (this.state.loading) {
            return null;
        }
        return (
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='#fff'/>
            </View>
        )

    }

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
                              <TouchableOpacity
                                  onPress={this.ShowModal.bind(this, true, item.images[1].url)} // item.image[1] get large image
                                  style={{flex: 1, flexDirection: 'column',}}>
                                  <Image style={styles.image}
                                         source={{uri: item.images[0].url}}  // item.image[0] get large image
                                  />
                              </TouchableOpacity>
                          }
                          numColumns={2}
                          keyExtractor={(item, index) => index}
                          ListFooterComponent={this.loader()}
                          onEndReachedThreshold={3}
                          onEndReached={({}) => {
                              this.newPage()
                          }}/>
                {
                    this.state.ModalVisibleStatus ? (
                        <Modal transparent={false} visible={this.state.ModalVisibleStatus} animationType={"fade"}
                               onRequestClose={() => {
                                   this.ShowModal(!this.state.ModalVisibleStatus)
                               }}>
                            <View style={styles.modal}>
                                <Image style={styles.modalImage} source={{uri: this.state.SelectImage}}/>
                                <TouchableOpacity actveOpacity={0.5} style={styles.closeButton}>
                                    <Button title='Close' onPress={() => {
                                        this.ShowModal(!this.state.ModalVisibleStatus)
                                    }}/>
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
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    image: {
        height: 200,
    },
    loader: {
        paddingVertical: 80
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
        width: '100%',
        resizeMode: 'contain'
    },
    closeButton: {
        top: 9,
        left: 9,
        position: 'absolute',
    }
});